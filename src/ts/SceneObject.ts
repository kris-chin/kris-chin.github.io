/*
SceneObject.ts

Base Wrapper Class for all objects. Adds some extra functions needed for engine-related purposes.
Extend your objects from this instead of THREE.Object3D. 

*/

import * as THREE from 'three';
import { Mesh } from 'three';
import World from './World';
import Behaviour from './Behaviour';

export class SceneObject {

    //Proposed Key Values for instantiation
    private key_geometry : string;
    private key_material : string;

    //Actual Geometry and Material
    private geometry! : (THREE.BufferGeometry | undefined);
    private material! : (THREE.Material | Array<THREE.Material> | undefined);
    private behaviours! : Array<Behaviour | undefined>;

    //Mesh Object
    mesh! : THREE.Mesh; //Code assumes Mesh will be initalized by the time the class is used

    //World Object (contains "Global" variables)
    world!: World;

    constructor(geometryString: string, materialString: string){
        this.key_geometry = geometryString;
        this.key_material = materialString;
    }

    //Points object to World object and loads in mesh
    Initialize(world: World, behaviours: Array<Behaviour | undefined>){
        this.world = world;
        this.behaviours = behaviours;

        //get geometry and material
        this.geometry = this.world.geometries.get(this.key_geometry)
        this.material = this.world.materials.get(this.key_material)
        
        //Flag for when we want to assign a "none" geometry or material
        let assignAnyways : boolean = false;

        //Report invalid keys if they don't exist. Allow blank keys to go through as "not assigning"
        if (this.key_geometry === "" ) {assignAnyways = true;}
        else if (!this.geometry) {console.error("Invalid Geometry: '" + this.key_geometry + "'")}

        if (this.key_material === "" ) {assignAnyways = true;}
        else if (!this.material) {console.error("Invalid Material: '" + this.key_material + "'")}

        //initialize mesh
        if ( (this.geometry && this.material) || (assignAnyways) ){
            this.mesh = new Mesh(this.geometry,this.material)
        }

    }

    //Called every frame
    Step(){

        //Go through any custom behaviours and run them
        for (let behaviour of this.behaviours){
            if (behaviour){
                behaviour.Step()
            }
        }
    }

}

export default SceneObject