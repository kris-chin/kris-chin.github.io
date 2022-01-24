/*
    World.ts 

    Contains all of our actual objects and "Global" Variables.
    Geometries and materials are all loaded through seperate loader classes.

    Provides a useful interface for loading and adding objects that point back to the World. (useful for "Global" varibales such as time)
*/

//THREE imports
import * as THREE from 'three';
import SceneObject from './SceneObject';
import Scene from './Scene';
import GeometryLoader from './GeometryLoader';
import MaterialLoader from './MaterialLoader';
import { KeyObjectLoader, KeyObject } from './KeyObjectLoader';
import BehaviourFactory from './BehaviourFactory';

//Arbitrary import of testWorld JSON 
import testWorld from '../data/testWorld.json';

///Interface for worldObjects
interface worldObject {
    name : string,
    args : args
}

//Interface for Optional AddObject Arguments
interface args{
    threeParent : THREE.Object3D,
    pos : {x: number, y: number, z: number} //Position
}

export class World extends THREE.Group {

    //Structures to hold all of our 3D information
    sceneObjects : Array<SceneObject>; //All objects in world
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

    //"Global" Variables
    time : number;

    //Add a bunch of geometry
    constructor(scene: Scene){
        super();
        this.scene = scene;
        this.time = 0;

        //Create our objects list and Maps
        this.sceneObjects = []
        this.materials = new Map<string,(THREE.Material | Array<THREE.Material>)>();
        this.geometries = new Map<string,THREE.BufferGeometry>();
        this.keyObjects = new Map<string,KeyObject>();
        this.behaviours = new BehaviourFactory(); //Behaviours are added to sceneobjects in AddObject()

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
            let object = new SceneObject(geometryKey, materialKey)

            //Push Object into world array
            this.sceneObjects.push(object)

            //Generate behaviours and apply to object
            let behaviours = behaviourKeys.map(key=>{
                return this.behaviours.GetBehaviour(key.name,object,key.params)
            })

            object.Initialize(this,behaviours); //Point the Object to the World and create mesh with behaviours

            if (object.mesh){

                let parent : THREE.Object3D = this
                if (args && args.threeParent) parent = args.threeParent //If parent argument is provided, set parent

                object.mesh.parent = parent //Set the threeJS parent
                object.mesh.castShadow = true; //Allow the object to cast a shadow
                object.mesh.receiveShadow = true; //Allow the object to recieve shdadows
                
                object.mesh.parent.add(object.mesh) //Add the Mesh to the THREE Group, which actually renders the mesh

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
    private PlaceObjects(worldObjectArray : Array<Object>){
        for (let o of worldObjectArray){
            const object = o as worldObject; //Cast as worldObject interface
            if (object.args) this.AddObject(object.name,object.args)
            else this.AddObject(object.name)
        }
    }

}

export default World