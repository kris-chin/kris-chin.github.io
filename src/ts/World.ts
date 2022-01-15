/*
World.ts

Contains all of our actual geometry and "Global" Variables

Type: Object3D.

*/

//THREE imports
import * as THREE from 'three';
import Cube from './objects/Cube';
import SceneObject from './objects/SceneObject';
import Scene from './Scene';
import GeometryLoader from './GeometryLoader';
import MaterialLoader from './MaterialLoader';

export class World extends THREE.Group {

    //Structures to hold all of our 3D information
    objects : Array<SceneObject>; //All objects in world
    geometries : Map<string,THREE.BufferGeometry>; //Map of all geometries used
    materials : Map<string,THREE.Material>; //Map of all materials used

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
        console.log("WORLD INSTANTIATED")
        console.log(this)
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

                cuber.mesh.rotation.z = ((Math.random() - 0.5) * 2) * 2;
            }
            
        }

    }

}

export default World