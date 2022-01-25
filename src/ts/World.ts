/*
    World.ts 

    Contains all of our actual objects and "Global" Variables.
    Geometries and materials are all loaded through seperate loader classes.

    Provides a useful interface for loading and adding objects that point back to the World. (useful for "Global" varibales such as time)
*/

//THREE imports
import * as THREE from 'three';
import SceneObject from './SceneObject';
import Scene, { CameraAngle } from './Scene';
import GeometryLoader from './GeometryLoader';
import MaterialLoader from './MaterialLoader';
import { KeyObjectLoader, KeyObject } from './KeyObjectLoader';
import BehaviourFactory from './BehaviourFactory';

//Arbitrary import of testWorld JSON 
import testWorld from '../data/testWorld.json';

//Interface for the Page States in the world
interface WorldState {
    name : string, //state name (ie. page location)
    stateSettings : StateSettings, //settings for the state
    cameraAngle : CameraAngle, //default camera angle for "page"
    objects : Array<Object> //array of WorldObjects (we keep this as Object instead of WorldObject for optional args)
}

//Settings for WorldStates
interface StateSettings {
    loadOutside : boolean //does this state load in the world even if it is not the current state? 
    resetOnEnter : boolean //does the state reset when it is entered?
}

///Interface for worldObjects
interface worldObject {
    name : string,
    args : args | undefined
}

//Interface for Optional AddObject Arguments
interface args{
    parent : SceneObject,
    pos : {x: number, y: number, z: number} //Position
}

export class World extends THREE.Group {

    //Structures to hold all of our 3D information
    sceneObjects : Array<SceneObject>; //All SceneObjects in world (not to be confused with MESHes)
    geometries : Map<string,THREE.BufferGeometry>; //Map of all geometries used
    materials : Map<string,(THREE.Material | Array<THREE.Material>)>; //Map of all materials used
    private behaviours : BehaviourFactory;
    private keyObjects : Map<string,KeyObject> //placeable objects. used for keys

    //Loaders for 3D information
    private loader_geometries : GeometryLoader;
    private loader_materials : MaterialLoader;
    private loader_keyObjects : KeyObjectLoader;

    //Respective Scene Object
    scene : Scene;
    private worldStates : Array<{worldState: WorldState, sceneObjects: (SceneObject | undefined)[]}>; //worldStates and their respective objects stored here

    //"Global" Variables
    time : number;

    //Add a bunch of geometry
    constructor(scene: Scene){
        super();
        this.scene = scene;
        this.time = 0;

        //Create our objects list and Maps
        this.sceneObjects = [] //Note: this is just an array of ALL sceneobjects. not for state-specific ones
        this.materials = new Map<string,(THREE.Material | Array<THREE.Material>)>();
        this.geometries = new Map<string,THREE.BufferGeometry>();
        this.keyObjects = new Map<string,KeyObject>();
        this.behaviours = new BehaviourFactory(); //Behaviours are added to sceneobjects in AddObject()
        this.worldStates = new Array<{worldState: WorldState, sceneObjects: (SceneObject | undefined)[]}>();

        //Setup Loaders and pass our maps into them for loading
        this.loader_materials = new MaterialLoader(this.materials);
        this.loader_geometries = new GeometryLoader(this.geometries);
        this.loader_keyObjects = new KeyObjectLoader(this.keyObjects);

        //Load Materials and Geometries asynchroniously. Place objects after promises are all collected
        Promise.all([
            this.loader_materials.LoadMaterials(),
            this.loader_geometries.LoadGeometries(),
            this.loader_keyObjects.LoadKeyObjects()]
        )
            .then(data => {
                this.materials = data[0] //set material map
                this.geometries = data[1] //set geometry map
                this.keyObjects = data[2]

                this.PlaceObjects(testWorld) //place objects. arbitrarily places based on testWorld
                console.log("%c World Instantiated%o", "color: green; font-weight: bold;", this)
            })
    }

    //Update all objects
    public Step(){
        for (let obj of this.sceneObjects){
            obj.Step();
        }

        this.time += 0.01
    }

    //Helper Method for pushing objects into array
    //Returns a reference to the new object in case you want to work with it
    public AddObject(objectKey : string, arg? : Object) : SceneObject | undefined {  
        const args = arg as args //Cast our Arguments as our args interface. This allows for optional arguments

        //First look for the object key in our map
        const keyObject = this.keyObjects.get(objectKey)

        //If the keyObject is inside our map
        if (keyObject){
            //get our keys from KeyObject
            let materialKey = keyObject.sceneObject.material;
            let geometryKey = keyObject.sceneObject.geometry;
            let behaviourKeys = keyObject.sceneObject.behaviours;

            //Determine if Material or Geometry have behaviours
            //NOTE: these behaviours are not appened to the "behaviours" list
            if (materialKey.startsWith("behaviour:")){
                const matBehaviour = materialKey.split(":")[1] //get the second element when you split by :, which should be the stuff after the "behaviour:"
                materialKey = this.behaviours.GetBehaviour(matBehaviour)?.Get()
            }

            if (geometryKey.startsWith("behaviour:")){
                const geoBehaviour = geometryKey.split(":")[1]
                geometryKey = this.behaviours.GetBehaviour(geoBehaviour)?.Get()
            }

            //Create new Object
            let object = new SceneObject(objectKey, geometryKey, materialKey)
            if (args && args.parent) object.parent = args.parent //set the SceneObject parent (NOT the mesh parent)

            //Push Object into world array
            this.sceneObjects.push(object)

            //Generate behaviours and apply to object
            let behaviours = behaviourKeys.map(key=>{
                return this.behaviours.GetBehaviour(key.name,object,key.params)
            })

            object.Initialize(this,behaviours); //Point the Object to the World and create mesh with behaviours

            if (object.mesh){

                //Set the threeJS mesh parent
                if (args && args.parent) object.mesh.parent = args.parent.mesh //set object's mesh parent to the parent's mesh
                else object.mesh.parent = this //set the object's mesh parent to the world

                object.mesh.name = objectKey //Set the mesh name to the object key
                object.mesh.castShadow = true; //Allow the object to cast a shadow
                object.mesh.receiveShadow = true; //Allow the object to recieve shdadows
                
                if (object.GetRenderState()) object.mesh.parent.add(object.mesh) //Add the Mesh to the THREE Group, which actually renders the mesh

                //If a position argument is provided, set the position
                if (args && args.pos) object.mesh.position.set(args.pos.x,args.pos.y,args.pos.z)

                return object
            } else {
                console.error("Failed to create mesh: %o", object)
                return undefined
            }
        } else {
            console.error(`Invalid Object Key: '${objectKey}'`)
            return undefined
        }
        
    }

    //Helper Method for placing objects given an array
    private PlaceObjects(worldStateArray : Array<WorldState>){

        for (let state of worldStateArray){
            let sceneObjects : Array<SceneObject | undefined> = []; //this state's SceneObject pointers
            
            //iterate through the objects of the state
            for (let o of state.objects) {
                const object = o as worldObject;
                let sceneObject : SceneObject | undefined;
                if (object.args) sceneObject = this.AddObject(object.name,object.args)
                else sceneObject = this.AddObject(object.name)

                //Stuff for only if the SceneObject was successfully created
                if (sceneObject){
                    if (state.stateSettings.loadOutside) sceneObject.SetRenderState(true)
                    else sceneObject.SetRenderState(false)

                }

                //Push our pointers to the scene object into the array
                sceneObjects.push(sceneObject)
            }

            //push into our worldStates array
            this.worldStates.push({worldState: state, sceneObjects: sceneObjects})
        }
        
        //TODO
        //Save all states in a seperate Array
        //Go through states and add their SceneObjects (don't add mesh yet).

        //  Point the sceneObjects to each state (so the state array contains pointers)
        //If the state is enabled OR the state can be enabled outside, add the mesh.
        //If not enabled, dont add the mesh.
        //  Only add the meshes for the associated scene objects on changeState().
        //  Reset objects accordingly on changeState()

            
    }

}

export default World