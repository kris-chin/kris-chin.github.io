/*
World.ts

Contains all of our actual geometry.

Type: Object3D.

*/

//THREE imports
import * as THREE from 'three';
import Cube from './objects/Cube';

export class World extends THREE.Group {

    cubes : Array<Cube>;

    //Add a bunch of geometry
    constructor(){
        super();

        console.log("WORLD INSTANTIATED (should only be once)")

        //I don't wanna make duplicate geos and materials
        var geometry = new THREE.BoxGeometry(0.5, 0.5,0.5);
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff});

        this.cubes = [];

        //Add some cubes
        for (let i = 0; i < 10; i++){

            let cuber = new Cube(geometry, material)
            this.cubes.push(cuber)
            
            this.add(cuber.mesh)

            cuber.mesh.position.x = ((Math.random() - 0.5) * 2) * 2;
            cuber.mesh.position.y = ((Math.random() - 0.5) * 2) * 2;
            cuber.mesh.rotation.z = ((Math.random() - 0.5) * 2) * 2;
            
        }
    }

    Step(){
        for (let cube of this.cubes){
            cube.Step();
        }
    }

}

export default World