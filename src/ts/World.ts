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
    private loader_geometries ?: GeometryLoader;
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

        //Create our objects list and Maps
        this.objects = []
        this.materials = new Map<string,(THREE.Material | Array<THREE.Material>)>();
        this.geometries = new Map<string,THREE.BufferGeometry>();

        //Setup Loaders and pass our maps into them for loading
        this.loader_materials = new MaterialLoader(this.materials);
        this.loader_geometries = new GeometryLoader(this.geometries);

        //Load Materials and Geometries asynchroniously. Place objects after promises are all collected
        const self = this;
        Promise.all([this.loader_materials.LoadMaterials(), this.loader_geometries.LoadGeometries()])
            .then(data => {
                self.materials = data[0] //set material map
                self.geometries = data[1] //set geometry map

                self.PlaceObjects()
                console.log("%c World Instantiated%o", "color: green; font-weight: bold;", this)
            })
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
        object.Initialize(this); //Point the Object to the World and create mesh

        if (object.mesh){

            object.mesh.parent = this //Set the world to be the parent

            object.mesh.castShadow = true; //Allow the object to cast a shadow
            object.mesh.receiveShadow = true;
            
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

        //Add a light (I didn't add compatibility for it yet with our SceneObject interface. but it IS an object3D)
        let light = new THREE.DirectionalLight(0xffffff,1)
        light.position.set(0, 4, 2); //position determines a directional light's direction
        //light.target.position.set(10,0,0);
        light.castShadow = true;
        this.add(light);

        let ambient = new THREE.AmbientLight(0xffffff, 0.25);
        this.add(ambient);

        //shadow helper
        //let helper = new THREE.CameraHelper(light.shadow.camera);
        //this.add(helper);

    }

}

export default World