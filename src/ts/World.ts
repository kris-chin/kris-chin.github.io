/*
    World.ts 

    Contains all of our actual objects and "Global" Variables.
    Geometries and materials are all loaded through seperate loader classes.

    Provides a useful interface for loading and adding objects that point back to the World. (useful for "Global" varibales such as time)
*/

//THREE imports
import * as THREE from 'three';
import Cube from './objects/Cube';
import SceneObject from './objects/SceneObject';
import Scene from './Scene';
import GeometryLoader from './GeometryLoader';
import MaterialLoader from './MaterialLoader';
import Skybox from './objects/Skybox';
import Plane from './objects/Plane';

export class World extends THREE.Group {

    //Structures to hold all of our 3D information
    objects : Array<SceneObject>; //All objects in world
    geometries : Map<string,THREE.BufferGeometry>; //Map of all geometries used
    materials : Map<string,(THREE.Material | Array<THREE.Material>)>; //Map of all materials used

    //Loaders for 3D information
    private loader_geometries : GeometryLoader;
    private loader_materials : MaterialLoader;

    //Respective Scene Object
    scene : Scene;

    //"Global" Variables
    time : number;

    //Add a bunch of geometry
    constructor(scene: Scene){
        super();
        this.scene = scene;
        this.time = 0;

        //Setup Loaders
        this.loader_materials = new MaterialLoader();
        this.loader_geometries = new GeometryLoader();
        
        //Initalize all of our 3D Information
        this.objects = [];
        this.geometries = this.loader_geometries.map
        this.materials = this.loader_materials.map

        //Place Objects 
        this.PlaceObjects()

        //Done
        console.log("%c World Instantiated%o", "color: green; font-weight: bold;", this)
    }

    //Update all objects
    public Step(){
        for (let obj of this.objects){
            obj.Step();
        }

        this.time += 0.01
    }

    //Helper Method for pushing objects into array
    public AddObject(object:SceneObject){
        
        this.objects.push(object) //Object is added in array
        object.parent = this //Set the world to be the parent

        object.Initialize(this); //Point the Object to the World and create mesh

        if (object.mesh){
            this.add(object.mesh) //Add the Mesh to the THREE Group, which actually renders the mesh
        } else {
            console.error("Failed to create mesh", object)
        }

    }

    //Helper Method for placing objects
    private PlaceObjects(){
        //Everything below this line is arbitrary
        //------------------------------------------------

        //Add some cubes
        for (let i = 0; i < 30; i++){

            let color = Math.random()
            let c : string;
            if (color < 0.25){
                c = 'red'
            } else if (color < 0.5) {
                c = 'blue'
            } else if (color < 0.75) {
                c = 'yellow'
            } else{
                c = 'green'
            }

            let cuber = new Cube('box' , c);
            this.AddObject(cuber);

            if (cuber.mesh){
                cuber.mesh.position.x = ( Math.cos(i/30 * 2*Math.PI)) * 2;
                cuber.mesh.position.y = ( Math.sin(i/30 * 2*Math.PI)) * 2;

                cuber.mesh.position.z = 0;

                cuber.mesh.rotation.z = ((Math.random() - 0.5) * 2) * 2;
            }
            
        }

        //Add a skybox
        let skybox = new Skybox('skybox', 'skybox0');
        this.AddObject(skybox);

        //Add a plane
        let plane = new Plane('plane', 'white');
        this.AddObject(plane);
        plane.mesh.position.set(0,-2.5,0);

    }

}

export default World