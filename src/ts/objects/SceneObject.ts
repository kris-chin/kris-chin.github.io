/*
SceneObject.ts

Base Wrapper Class for all objects. Adds some extra functions needed for engine-related purposes.
Extend your objects from this instead of THREE.Object3D. 

*/

import * as THREE from 'three';
import { Mesh } from 'three';
import World from '../World';

export abstract class SceneObject extends THREE.Object3D {

    //Proposed Key Values for instantiation
    private key_geometry : string;
    private key_material : string;

    //Actual Geometry and Material
    private geometry! : (THREE.BufferGeometry | undefined);
    private material! : (THREE.Material | undefined);

    //Mesh Object
    mesh! : THREE.Mesh; //Code assumes Mesh will be initalized by the time the class is used

    //World Object (contains "Global" variables)
    world!: World;

    constructor(key_geometry: string, key_material: string){
        super();
        this.key_geometry = key_geometry;
        this.key_material = key_material;
    }

    //Points object to World object and loads in mesh
    Initialize(world: World){
        this.world = world;

        //get geometry and material
        this.geometry = this.world.geometries.get(this.key_geometry)
        this.material = this.world.materials.get(this.key_material)

        //initialize mesh
        if (this.geometry && this.material){
            this.mesh = new Mesh(this.geometry,this.material)
        }


    }

    //Called every frame
    Step(){}

}

export default SceneObject