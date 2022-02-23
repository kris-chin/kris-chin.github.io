/*
    GLBLoader.ts

    Loads a given GLB file.
    Returns a promise which resolves into a nested mesh

*/
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import World from '../World';

interface GLB {
    name: string,
    filepath: string
}

interface GLTF{
    animations: Array<THREE.AnimationClip>,
    scene: THREE.Group,
    scenes: Array<THREE.Group>,
    asset: Object
}

export default class GLBloader {

    map: Map<string, THREE.Object3D>; //Engine Map 
    world : World; 
    glbs : Array<GLB>

    constructor(map: Map<string, THREE.Object3D>, parentWorld: World, glbs: Array<Object>) {
        this.map = map;
        this.world = parentWorld;
        this.glbs = glbs as Array<GLB>;
    }

    LoadGLBs(): Promise< Map<string, THREE.Object3D> > {
        var promise = new Promise< Map<string, THREE.Object3D> >((resolve,reject) => {

            const gltf_loader = new GLTFLoader();

            //create a promise array for every GLB
            var promiseList = new Array<Promise<{name: string, GLTF: GLTF}>>();

            //go through GLBs list and push a promise for every GLB
            for (let glb of this.glbs){
                console.log(`Now Loading glb: '${glb.name}'`)
                promiseList.push(new Promise<{name: string, GLTF: GLTF}>( (resolve,reject) => {
                    gltf_loader.load(
                        glb.filepath,
                        (gltf: Object) => {
                            resolve({name: glb.name, GLTF: gltf as GLTF})
                        },
                        (xhr: any)=>{
                            console.log(`${(xhr.loaded/xhr.total * 100)}% loaded`)
                        },
                        (error)=>{
                            console.error("Load Failed:\n", error)
                            reject();
                        }
                    )
                    

                }));
            }

            //wait for all GLB promimses
            Promise.all(promiseList)
            .then(data=>{
                for (let object of data){
                    this.map.set(object.name, object.GLTF.scene)
                }
                resolve(this.map)
            })

        });

        return promise;
    }

}