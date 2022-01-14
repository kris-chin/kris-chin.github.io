/*
World.ts

Contains all of our actual geometry and "Global" Variables

Type: Object3D.

*/

//THREE imports
import * as THREE from 'three';
import Cube from './objects/Cube';
import SceneObject from './objects/SceneObject';

export class World extends THREE.Group {

    //All objects in world
    objects : Array<SceneObject>;

    //"Global" Variables
    time : number;

    //Add a bunch of geometry
    constructor(){
        super();
        this.time = 0;
        this.objects = [];

        //Everything below this line is arbitrary
        //------------------------------------------------

        //I don't wanna make duplicate geos and materials
        var geometry = new THREE.BoxGeometry(0.5, 0.5,0.5);
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff});

        //Add some cubes
        for (let i = 0; i < 30; i++){

            let cuber = new Cube(geometry, material)
            this.AddObject(cuber)

            cuber.mesh.position.x = ((Math.random() - 0.5) * 2) * 2;
            cuber.mesh.position.y = ((Math.random() - 0.5) * 2) * 2;
            cuber.mesh.rotation.z = ((Math.random() - 0.5) * 2) * 2;
            
        }

        console.log("WORLD INSTANTIATED")
        console.log(this)
    }

    //Update all objects
    Step(){
        for (let obj of this.objects){
            obj.Step();
        }

        this.time += 0.01
    }

    //Helper Class for pushing objects into array
    AddObject(object:SceneObject){
        
        this.objects.push(object) //Object is added in array
        object.parent = this //Set the world to be the parent

        if (object.mesh){
            this.add(object.mesh) //Add the Mesh to the THREE Group, which actually renders the mesh
        }

    }

}

export default World