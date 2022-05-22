/*
    GeometryLoader.ts

    Responsible for loading all Geometries.

*/

import * as THREE from 'three';
import JSON5 from 'json5';

const filePath : string = '/data/json/geometries.json5'

interface Geometry {
    name : string,
    type : string,
    geometryParameters : Object
}

interface BoxParams{
    size: {
        x: number,
        y: number,
        z: number
    }
}

interface PlaneParams{
    width: number,
    height: number
}

export class GeometryLoader {

    map : Map<string,THREE.BufferGeometry>

    constructor(map: Map<string,THREE.BufferGeometry>){
        this.map = map
    }

    //Asynchronous call to load geometries. Promises a Map of the geometries
    LoadGeometries() : Promise< Map<string,THREE.BufferGeometry> > {
        var promise = new Promise< Map<string,THREE.BufferGeometry> >( (resolve,reject) => {
            
            //Wait for geometry data and then map it
            fetch(filePath)
            .then(response => response.text())
            .then(data => {

                //Parse the JSON5 file
                const geometries : Array<Geometry> = JSON5.parse(data)

                //Start mapping geometries to map
                this.MapGeometries(geometries)

                //Resolve Promise
                resolve(this.map)
            })
            
        })

        return promise
    }

    //Adds Basic Geometries to Geometry Map
    MapGeometries(geometries: Array<Geometry>){

        for (let geometry of geometries){

            switch (geometry.type){
                case "box":
                    const boxParams = geometry.geometryParameters as BoxParams;
                    const d = boxParams.size;
                    this.map.set(geometry.name, new THREE.BoxGeometry(d.x, d.y, d.z));
                    break;
                case "plane":
                    const planeParams = geometry.geometryParameters as PlaneParams;
                    this.map.set(geometry.name, new THREE.PlaneGeometry(planeParams.width,planeParams.height))
                    break;
                default:
                    console.error(`Invalid Geometry Type: '${geometry.type}'`)
                    break;
            }

        }
    }
    
}

export default GeometryLoader