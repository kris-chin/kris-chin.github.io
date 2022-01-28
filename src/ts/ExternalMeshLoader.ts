/*
    ExternalMeshLoader.ts

    Loader Class responsible for loading whole meshes. Typically in OBJ files
    Saves the Meshes in a map with strings for keys.

    The class loads from data/Models.json because all the model data is already stored in /models/ and doesn't need any configuration
    We still use a promise because of the external loading of OBJ files
*/

import * as THREE from 'three'
import {OBJLoader} from '../js/OBJLoader';
import models from '../data/models.json'

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
    filePath : string,
    params: Object
}

export default class ExternalMeshLoader {

    map : Map<string, THREE.Mesh>

    constructor(map: Map<string, THREE.Mesh>){
        this.map = map;
    }

    LoadExternalMeshes() : Promise< Map<string, THREE.Mesh> >{
        var promise = new Promise< Map<string, THREE.Mesh> >( (resolve,reject) =>{

            const loader = new OBJLoader();

            var promiseList = new Array<Promise<{name: string,mesh: THREE.Mesh, params: Object} >>();

            //Go through models json and load each file. when done map it to our map
            for (let m of models){
                const model = m as ModelInterface;
                var inGroup : boolean = false;

                //Push promises for every single mesh
                promiseList.push(
                    new Promise< {name: string, mesh: THREE.Mesh, params: Object} >( (resolve,reject)=>{
                        loader.load(
                            model.filePath,
                            (object: THREE.Object3D) =>{
                                console.groupEnd()
                                resolve({name: model.name, mesh: object as THREE.Mesh, params: model.params})
                            },
                            (xhr : any)=>{ //I cant seem to find the type for XMLHTTPRequest that has .loaded and .total
                                if (!inGroup){
                                    console.groupCollapsed(`Loading Mesh: '${model.name}'`)
                                    inGroup = true;
                                }
                                console.log(`${(xhr.loaded/xhr.total * 100)}% loaded`)
                            },
                            ()=>{
                                console.error(`Error loading '${model.name}'`)
                                console.groupEnd()
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