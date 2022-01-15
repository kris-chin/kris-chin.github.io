/*
    GeometryLoader.ts

    Responsible for loading all Geometries.

*/

import * as THREE from 'three';

export class GeometryLoader {

    map : Map<string,THREE.BufferGeometry>

    constructor(){
        this.map = new Map<string,THREE.BufferGeometry>();

        //Start adding pairs to our map
        this.MapBasicGeometries();
    }

    //Adds Basic Geometries to Geometry Map
    MapBasicGeometries(){
        this.map.set('box', new THREE.BoxGeometry(0.5, 0.5,0.5));
    }
    

}

export default GeometryLoader