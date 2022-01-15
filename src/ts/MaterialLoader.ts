/*
    MaterialLoader.ts

    Responsible for loading all Materials.

*/

import * as THREE from 'three';

export class MaterialLoader {

    map : Map<string,THREE.Material>

    constructor(){
        this.map = new Map<string,THREE.Material>();

        //Start adding pairs to our map
        this.MapBasicMaterials();
    }

    //Adds Basic Materials to Material Map
    MapBasicMaterials(){
        this.map.set('red', new THREE.MeshBasicMaterial( { color: 0xff4040}));
        this.map.set('yellow', new THREE.MeshBasicMaterial( { color: 0xffec40}));
        this.map.set('green', new THREE.MeshBasicMaterial( { color: 0x17a64b}));
        this.map.set('blue', new THREE.MeshBasicMaterial( { color: 0x424bf5}));

    }
    

}

export default MaterialLoader