/*
    ExternalMeshLoader.ts

    Loader Class responsible for loading OBJ Files
    Saves the Meshes in a map with strings for keys.

    The class loads from data/Models.json because all the model data is already stored in /models/ and doesn't need any configuration
    We still use a promise because of the external loading of OBJ files
*/

import * as THREE from 'three'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import World from '../World';

interface ModelParams{
    defaultScale:  {
        x: number,
        y: number,
        z: number
    },
    defaultRotation : {
        x: number,
        y: number,
        z: number
    }
}

interface ModelInterface {
    name : string,
    filePath_obj : string,
    filePath_mtl : string,
    params: Object
}

export default class ExternalMeshLoader {

    map : Map<string, THREE.Mesh>
    world : World; //pointer to world so we can access the textLayer
    models: Array<Object>;

    constructor(map: Map<string, THREE.Mesh>, parentWorld: World, modelsArray : Array<Object>){
        this.map = map;
        this.world = parentWorld;
        this.models = modelsArray;
    }

    LoadExternalMeshes() : Promise< Map<string, THREE.Mesh> >{
        var promise = new Promise< Map<string, THREE.Mesh> >( (resolve,reject) =>{

            const obj_loader = new OBJLoader();
            const mtl_loader = new MTLLoader();

            var promiseList = new Array<Promise<{name: string,mesh: THREE.Mesh, params: Object} >>();
            
            var currentTotalProgress = 0; //every time a loader loads a model. add to this
            const neededTotalProgress = this.models.length; //all models total up to this value when fully loaded

            //Define some getters and setters for the promises to use to avoid resource issues
            const incrementProgress = (amt: number) => currentTotalProgress += amt;
            const getProgress = () => {return currentTotalProgress;}

            //Go through models json and load each file. when done map it to our map
            for (let m of this.models){
                const model = m as ModelInterface;
                const textLayer = this.world.scene.canvas.textLayer;

                //Push promises for every single mesh
                promiseList.push(
                    new Promise< {name: string, mesh: THREE.Mesh, params: Object} >( (resolve,reject)=>{
                        var inGroup : boolean = false;
                        var previousLoaded : number = 0;

                        //We will first the MTL, then laod the OBJ.
                        mtl_loader.load(
                            model.filePath_mtl,
                            (materialCreator : any ) =>{
                                //Now that we loaded our MTL, set our materials and load our OBJ
                                obj_loader.setMaterials(materialCreator) //Set our materials before we load
                                obj_loader.load(
                                    model.filePath_obj,
                                    (object: THREE.Object3D) =>{ //Finished loading mesh
                                        console.groupEnd()

                                        resolve({name: model.name, mesh: object as THREE.Mesh, params: model.params})
                                    },
                                    (xhr : any)=>{ //I cant seem to find the type for XMLHTTPRequest that has .loaded and .total
                                        if (!inGroup){
                                            console.groupCollapsed(`Loading Mesh: '${model.name}'`)
                                            inGroup = true;
                                        }
                                        console.log(`${(xhr.loaded/xhr.total * 100)}% loaded`)
        
                                        //Send info to TextLayer
                                        incrementProgress( (xhr.loaded/xhr.total) - previousLoaded) //calculate amount added
                                        previousLoaded = (xhr.loaded/xhr.total);
                                        textLayer.UpdateProgress(getProgress()/neededTotalProgress)
                                    },
                                    ()=>{
                                        console.error(`Error loading OBJ of '${model.name}'`)
                                        console.groupEnd()
                                        reject()
                                    }
                                )
                            },
                            (xhr : any) => {}, //don't do anything for onProgress
                            () => {
                                console.error(`Error loading MTL of '${model.name}'`)
                                reject()
                            }
                        )
                    })
                )    
            }

            //wait for all promises
            Promise.all(promiseList)
            .then(data=>{
                for (let object of data){
                    //Apply any params such as scale and rotation
                    const params = object.params as ModelParams
                    if (params.defaultScale) object.mesh.scale.set(params.defaultScale.x, params.defaultScale.y, params.defaultScale.z)
                    if (params.defaultRotation) object.mesh.rotation.set(params.defaultRotation.x,params.defaultRotation.y,params.defaultRotation.z)
                    
                    //when an external mesh is loaded, it is loaded as a group.
                    //because all of our objects are one mesh, we are going to automatically take the first child
                    const mesh = object.mesh.children[0]

                    //Map a reusable clone of our mesh
                    this.map.set(object.name, mesh.clone() as THREE.Mesh)
                }
                resolve(this.map)
            })

        })

        return promise
    }
    
}