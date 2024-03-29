/*
SceneObject.ts

Base Wrapper Class for all objects. Adds some extra functions needed for engine-related purposes.
Extend your objects from this instead of THREE.Object3D. 

*/

import * as THREE from 'three';
import { Mesh } from 'three';
import World, { args } from './World';
import Behaviour from './Behaviour';

export class SceneObject {

    //Proposed Key Values for instantiation
    private key_geometry : string | undefined;
    private key_material : string | undefined;
    private key_mesh : string | undefined; //key used for if we want to load an entire mesh

    //Actual Geometry and Material
    private geometry! : (THREE.BufferGeometry | undefined);
    private material! : (THREE.Material | Array<THREE.Material> | undefined);
    public behaviours! : Array<Behaviour | undefined> | null;

    name : string;
    parent : SceneObject | null; //parent SceneObject. we actually set it in AddObject()
    children : SceneObject[] | null; //array of children. this is also set in AddObject()
    id : number;
    uniqueId: string | null; //CSS-like identifier of object. optional
    state : string; //associated state
    debug : boolean; //is debug enabled?

    //Mesh Object
    mesh !: THREE.Object3D | null | undefined; //The outer mesh used for position and rotation computation
    innerMesh !: THREE.Mesh | null | undefined; //This is the inner mesh for actual rotation manipulation
    initialArgs : args | undefined; //initial args that the object was created with

    //World Object (contains "Global" variables)
    world!: World;

    //State-Related
    private isRendered : boolean; //set false if the object shouldn't be rendered (ie. mesh shouldn't be added to World)
    private CHECK_RENDER : boolean; //flag for when checking if the object is rendered already occured

    constructor(info: {name : string, id: number, uniqueId : string | null, state: string, debug: boolean}, meshInfo: {geometryString: string, materialString: string, meshString: string}, initialArgs : (Object | undefined)){
        this.name = info.name;
        this.id = info.id;
        this.uniqueId = info.uniqueId;
        this.state = info.state;
        this.debug = info.debug; //Set debug mode based on arg
        this.parent = null;
        this.children = new Array<SceneObject>();
        this.key_geometry = meshInfo.geometryString;
        this.key_material = meshInfo.materialString;
        this.key_mesh = meshInfo.meshString;
        this.isRendered = true;
        this.CHECK_RENDER = false;
        this.initialArgs = initialArgs as args; //save initial args in case we want to re-set the object
    }

    //Points object to World object and loads in mesh
    Initialize(world: World, behaviours: Array<Behaviour | undefined>){
        this.world = world;
        if (behaviours) this.behaviours = behaviours;
        else this.behaviours = new Array<Behaviour | undefined>();

        //get geometry and material
        this.geometry = this.world.geometries.get(this.key_geometry!)
        this.material = this.world.materials.get(this.key_material!)
        
        //Flag for when we want to assign a "none" geometry or material
        let assignAnyways : boolean = false;

        //Report invalid keys if they don't exist. Allow blank keys to go through as "not assigning"
        if (this.key_geometry === undefined) {assignAnyways = true;}
        else if (!this.geometry) {console.error(`Invalid Geometry: '${this.key_geometry}'`)}

        if (this.key_material === undefined ) {assignAnyways = true;}
        else if (!this.material) {console.error(`Invalid Material: '${this.key_material}'`)}

        //initialize mesh
        if ( (this.geometry && this.material) || (assignAnyways) ){

            //This is where we load our external mesh
            if (this.key_mesh !== undefined){
                //attempt to get mesh
                this.innerMesh = this.world.externalMeshes.get(this.key_mesh)

                if (!this.innerMesh) {
                    console.error(`Invalid External Mesh: '${this.key_mesh}'`)
                    //set mesh to nothing
                    this.innerMesh = new Mesh(this.geometry, this.material)
                }

            } else {
                this.innerMesh = new Mesh(this.geometry,this.material)
            }

            //Nest the mesh within another Object3D for easier computation of positions when things are rotating
            this.mesh = new THREE.Group()
            this.mesh.add(this.innerMesh)
            //this.mesh = this.innerMesh;
        }

    }

    //Helper function for when 
    private meshIsInWorld = () => {
        let topMesh : THREE.Object3D = this.mesh!
        if (topMesh)
            while (topMesh.parent)
            {
                if (topMesh.parent.type === 'Mesh') topMesh = topMesh.parent as THREE.Mesh
                else break
            }

        //now that we have the topMesh, check if the worsld has the topMesh
        return this.world.children.includes(topMesh)
    }

    //Called every frame
    Step(){
        //Check if we should be rendering the object
        if (this.isRendered){
            if (!this.CHECK_RENDER){ //flag to avoid unecessary computation with .includes()
                if (!this.meshIsInWorld()) { //if the mesh is not added yet and needs to be added
                    if (this.parent) this.parent.mesh!.add(this.mesh!)
                    else this.world.add(this.mesh!)
                    //console.log(`Added ${this.name}`)
                }
                this.CHECK_RENDER = true;
            }

        } else {
            if (!this.CHECK_RENDER){ //flag to avoid unecessary computation with .includes()
                if (this.meshIsInWorld()){ //if the mesh exists and needs to be removed
                    if (this.parent) this.parent.mesh!.remove(this.mesh!)
                    else this.world.remove(this.mesh!)
                    console.log(`Removed ${this.name}`)
                }
                this.CHECK_RENDER = true;
            }
        }

        //Go through any custom behaviours and run them Regardeless of Render
        if (this.behaviours){
            for (let behaviour of this.behaviours!){
                    if (behaviour){
                        behaviour.Step()
                    }
            }
        }
    }

    SetRenderState(state: boolean){
        //console.log(`Setting state of '${this.name}' to: ${state}`)
        this.isRendered = state
        this.CHECK_RENDER = false; //reset flag
    }

    GetRenderState(){
        return this.isRendered
    }

    //Finds and returns a specified behaviour type within the SceneObject
    //If there are multiple behaviours of the same type, it finds the first one
    //behaviour_constructor should be passed in the Class Type itself, not an object 
    FindBehaviour(behaviour_constructor : Function ) : Behaviour | null{

        for (let b of this.behaviours!){
            if (b instanceof behaviour_constructor)
                return b;
        }

        return null;
    }

}

export default SceneObject