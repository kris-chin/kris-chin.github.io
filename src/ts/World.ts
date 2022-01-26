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
import {CanvasProps} from './Canvas';
import GeometryLoader from './GeometryLoader';
import MaterialLoader from './MaterialLoader';
import { KeyObjectLoader, KeyObject } from './KeyObjectLoader';
import BehaviourFactory from './BehaviourFactory';

//Arbitrary import of testWorld JSON 
import testWorld from '../data/testWorld.json';
import anime from 'animejs';

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
export interface args{
    parent : SceneObject,
    pos : {x: number, y: number, z: number} //Position
    rot : {x: number, y: number, z:number} //Rotation
}

export class World extends THREE.Group {

    //Structures to hold all of our 3D information
    sceneObjects : Array<SceneObject | null>; //All SceneObjects in world (not to be confused with MESHes)
    geometries : Map<string,THREE.BufferGeometry>; //Map of all geometries used
    materials : Map<string,(THREE.Material | Array<THREE.Material>)>; //Map of all materials used
    behaviours : BehaviourFactory;
    private keyObjects : Map<string,KeyObject> //placeable objects. used for keys

    //Loaders for 3D information
    private loader_geometries : GeometryLoader;
    private loader_materials : MaterialLoader;
    private loader_keyObjects : KeyObjectLoader;

    //Respective Scene Object
    scene : Scene;
    private worldStates : Array<{worldState: WorldState, sceneObjects: (SceneObject)[]}>; //worldStates and their respective objects stored here
    currentState !: {worldState : WorldState, sceneObjects: (SceneObject)[]}

    //"Global" Variables
    time : number;
    totalIDs : number; //increments every time there is a new ID

    //Add a bunch of geometry
    constructor(scene: Scene){
        super();
        this.scene = scene;
        this.time = 0;
        this.totalIDs = 0;

        //Create our objects list and Maps
        this.sceneObjects = [] //Note: this is just an array of ALL sceneobjects. not for state-specific ones
        this.materials = new Map<string,(THREE.Material | Array<THREE.Material>)>();
        this.geometries = new Map<string,THREE.BufferGeometry>();
        this.keyObjects = new Map<string,KeyObject>();
        this.behaviours = new BehaviourFactory(); //Behaviours are added to sceneobjects in AddObject()
        this.worldStates = new Array<{worldState: WorldState, sceneObjects: (SceneObject)[]}>();

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

                //Initialize current state to page prop
                const desiredState = this.worldStates.filter( (worldState)=>{return (worldState.worldState.name === (this.scene.canvas.props as CanvasProps).page)})
                if (desiredState.length === 1){
                    this.currentState = desiredState[0]
                    this.scene.MoveCamera(this.currentState.worldState.cameraAngle,{
                        easing: 'linear',
                        duration: 1 //set a really fast duration so it's not noticiable on pageLoad
                    })

                    //if this new state needs to be rendered, render objects
                    if (this.currentState.worldState.stateSettings.loadOutside === false){
                        for (let o of this.currentState.sceneObjects){ //currentState is now pointing to something else
                            if (o) o.SetRenderState(true)
                        }
                    }

                } else {
                    //Load the first state
                    this.currentState = this.worldStates[0]
                    console.error(`State: '${(this.scene.canvas.props as CanvasProps).page}' doesn't exist.\nDefaulting to the first state: '${this.currentState.worldState.name}'`)
                    window.history.pushState('','',this.currentState.worldState.name) //change URL
                    this.scene.MoveCamera(this.currentState.worldState.cameraAngle,{
                        easing: 'linear',
                        duration: 1 //set a really fast duration so it's not noticiable on pageLoad
                    })

                    //if this new state needs to be rendered, render objects
                    if (this.currentState.worldState.stateSettings.loadOutside === false){
                        for (let o of this.currentState.sceneObjects){ //currentState is now pointing to something else
                            if (o) o.SetRenderState(true)
                        }
                    }
                }

                console.log("%c World Instantiated%o", "color: green; font-weight: bold;", this)
            })
    }

    //Update all objects
    public Step(){
        for (let obj of this.sceneObjects){
            if (obj) obj.Step();
        }

        this.time += 0.01
    }

    //Helper Method for pushing objects into array
    //Returns a reference to the new object in case you want to work with it
    public AddObject(info : {key : string, state: string}, arg? : Object) : SceneObject | null {  
        const args = arg as args //Cast our Arguments as our args interface. This allows for optional arguments

        //First look for the object key in our map
        const keyObject = this.keyObjects.get(info.key)

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
            let object = new SceneObject({name: info.key, id: this.totalIDs, state: info.state} , geometryKey, materialKey, arg)
            this.totalIDs += 1; //increment total IDs
            if (args && args.parent){
                object.parent = args.parent //set the SceneObject parent (NOT the mesh parent)
                object.parent.children!.push(object) //push the sceneobject as a child
            }

            //Push Object into world array
            this.sceneObjects.push(object)

            //Generate behaviours and apply to object
            let behaviours = behaviourKeys.map(key=>{
                return this.behaviours.GetBehaviour(key.name,object,key.params)
            })

            object.Initialize(this,behaviours); //Point the Object to the World and create mesh with behaviours

            if (object.mesh){

                //Set the threeJS mesh parent (NOT SCENEOBJECT PARENT)
                if (args && args.parent) object.mesh.parent = args.parent.mesh as THREE.Object3D //set object's mesh parent to the parent's mesh
                else object.mesh.parent = this //set the object's mesh parent to the world

                object.mesh.name = info.key //Set the mesh name to the object key
                object.mesh.castShadow = true; //Allow the object to cast a shadow
                object.mesh.receiveShadow = true; //Allow the object to recieve shdadows
                
                if (object.GetRenderState()) object.mesh.parent.add(object.mesh) //Add the Mesh to the THREE Group, which actually renders the mesh

                //If a position argument is provided, set the position
                if (args && args.pos) object.mesh.position.set(args.pos.x,args.pos.y,args.pos.z)

                return object
            } else {
                console.error("Failed to create mesh: %o", object)
                return null
            }
        } else {
            console.error(`Invalid Object Key: '${info.key}'`)
            return null
        }
        
    }

    public ResetObject(sceneObject : SceneObject){
        //Make New Object
        let object = this.AddObject({key: sceneObject.name, state: sceneObject.state},sceneObject.initialArgs)
        
        //Add to resepective state
        if (object){
            const state = this.worldStates.filter((state)=>{return (state.worldState.name === object!.state)})
            if (state.length === 1){
                state[0].sceneObjects.push(object)
            }
        }

        //Delete Original Object
        this.DestroyObject(sceneObject)
    }

    //Destroys Object from World. Returns a boolean if the object was successfully deleted
    public DestroyObject(sceneObject : SceneObject) {
        
        //Remove this SceneObject from World's sceneObjects list
        const index = this.sceneObjects.indexOf(sceneObject)
        this.sceneObjects.splice(index,1)

        //Clear the mesh's children
        sceneObject.mesh!.clear()

        //Remove this object mesh from it's parent, OR the world
        if (sceneObject.parent) sceneObject.parent.mesh!.remove(sceneObject.mesh!)
        else this.remove(sceneObject.mesh!)

        sceneObject.mesh = null //dereference mesh

        //Find Original Object Pointer in state and remove from it's associated state
        const state = this.worldStates.filter((state)=>{return (state.worldState.name === sceneObject.state)})
        if (state.length === 1){

            //Get the index of the pointer for the old object. point it to the new object
            const originalIndex = state[0].sceneObjects.indexOf(sceneObject);
            state[0].sceneObjects.splice(originalIndex,1) //remove object from array


        } else {
            console.error("Couldn't find associated state for object")
        }

        //Go through the sceneObject's behaviours and call OnDestroy()
        if (sceneObject.behaviours){
            for (let behaviour of sceneObject.behaviours){
                if (behaviour)behaviour.OnDestroy()
            }
            sceneObject.behaviours = null //dereference behaviours
        }

    }

    //Helper Method for placing objects given an array
    private PlaceObjects(worldStateArray : Array<WorldState>){

        for (let state of worldStateArray){
            let stateSceneObjects : Array<SceneObject> = []; //this state's SceneObject pointers
            
            //iterate through the objects of the state
            for (let o of state.objects) {
                const object = o as worldObject;
                let sceneObject : SceneObject | null;
                if (object.args) sceneObject = this.AddObject({key: object.name, state: state.name},object.args)
                else sceneObject = this.AddObject({key: object.name, state: state.name})

                //Stuff for only if the SceneObject was successfully created
                if (sceneObject){
                    if (state.stateSettings.loadOutside) sceneObject.SetRenderState(true)
                    else sceneObject.SetRenderState(false)

                    //Push our pointers to the scene object into the array
                    stateSceneObjects.push(sceneObject) 
                } else {
                    console.error("SceneObject was not successfully created")
                }
            }

            //push into our worldStates array
            this.worldStates.push({worldState: state, sceneObjects: stateSceneObjects})
        }
        
            
    }

    //Change the world state and set render modes of the state's respective objects
    ChangeState(state : string, animeParams?: anime.AnimeParams){

        //check if the provided state exists
        const desiredState = this.worldStates.filter( (worldState)=>{return (worldState.worldState.name === state) })
        if (desiredState.length === 1){

            //Change URL
            window.history.pushState('','',state)

            //check if current state only renders when selected
            //if it is, disable rendering for those objects
            if (this.currentState.worldState.stateSettings.loadOutside === false) {
                for (let o of this.currentState.sceneObjects){
                    if (o) o.SetRenderState(false)
                }
            }

            //change actual state
            this.currentState = desiredState[0]
            //move camera accordingly
            if (animeParams) this.scene.MoveCamera(desiredState[0].worldState.cameraAngle, animeParams)
            else this.scene.MoveCamera(desiredState[0].worldState.cameraAngle)

            //if this new state needs to be rendered, render objects
            if (desiredState[0].worldState.stateSettings.loadOutside === false){
                for (let o of this.currentState.sceneObjects){ //currentState is now pointing to something else
                    if (o) o.SetRenderState(true)
                }
            }

            //if this new state needs to be reset, reset objects
            if (desiredState[0].worldState.stateSettings.resetOnEnter){

                //We don't use an "of" iterator, instead, we loop the length of the array
                //This is because using javascript's of iterator doesn't work with this function since it modifies the items in the array
                //It's hella hacky and if you change the Reset() function, you'll need to modify the behaviour here
                for (let i = 0; i < this.currentState.sceneObjects.length; i++){
                    const object = this.currentState.sceneObjects[0] //we always get the first object in the array because ResetObject() modifies the array.
                    this.ResetObject(object);
                }
            }
        } else {
            console.error(`Invalid State: '${state}' \nKeeping Original State: '${this.currentState.worldState.name}'`)
        }
    }

    //Returns State Name
    GetState(){
        return this.currentState.worldState.name
    }

}

export default World