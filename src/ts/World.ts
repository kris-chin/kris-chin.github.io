/*
World.ts

Contains all of our actual geometry.

Type: Object3D.

*/

//THREE imports
import * as THREE from 'three';

export class World extends THREE.Object3D {

    //Add a bunch of geometry
    constructor(){
        super();

        var box = new THREE.BoxGeometry(1, 1,1);
        var mat = new THREE.MeshBasicMaterial( { color: 0xffffff});
        var cube1 = new THREE.Mesh(box, mat);
        var cube2 = new THREE.Mesh(box,mat);

        this.add(cube1);
        this.add(cube2);

        cube1.position.y = 1;

        cube2.position.x = 1;
    }

}

export default World