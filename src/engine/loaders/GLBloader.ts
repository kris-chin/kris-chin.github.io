/*
    GLBLoader.ts

    Loads a given GLB file.
    Returns a promise which resolves into a nested mesh

*/
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import World from '../World';
import {PMREMGenerator} from 'three/src/extras/PMREMGenerator';

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
    glbs : Array<GLB>;
    meshStandardMaterials: Array<THREE.MeshStandardMaterial>;

    constructor(map: Map<string, THREE.Object3D>, parentWorld: World, glbs: Array<Object>) {
        this.map = map;
        this.world = parentWorld;
        this.glbs = glbs as Array<GLB>;

        this.meshStandardMaterials = new Array<THREE.MeshStandardMaterial>();
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
                            console.log(`${((xhr.loaded/xhr.total) * 100)}% loaded`)
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
            .then( data=>{
                for (let object of data){

                    const obj3D : THREE.Object3D = object.GLTF.scene;
                    
                    //Recursive function that accesses any Mesh Object that was created 
                    //We do this to collect pointers to our envMaps so we can set them later once the scene is done being loaded
                    const saveMaterials = (object: THREE.Object3D) => {
                        object.children.forEach(saveMaterials);
                        if (!(object instanceof THREE.Mesh)) return;
                        if (!(object.material instanceof THREE.MeshStandardMaterial)) return;
                        
                        //Save the material to our list for later
                        this.meshStandardMaterials.push(object.material);
                    }

                    saveMaterials(obj3D);

                    object.GLTF.scene.animations = object.GLTF.animations //Set imported animations to this the Object3D
                    this.map.set(object.name, obj3D);
                }
                resolve(this.map)
            } )

        });

        return promise;
    }

    //Takes saved Materials and assigns properties to them 
    //call this after all objects have been loaded
    SetMaterialProperties(){

        //First, generate an envMAP of the completed scene
        const pmrem: PMREMGenerator = new PMREMGenerator(this.world.scene.renderer);
        const texture : THREE.Texture = pmrem.fromScene(this.world.scene.scene).texture;

        for (let material of this.meshStandardMaterials){

            //TODO: if the material requires specific set texture maps (eg. alphaMap, aoMap, bumpMap, etc), then apply them. this may not be the best place to do it. 
            //NOTE: These maps can be acquired via seperate bakes in Blender,

            //TODO: Read object3D.userData and change MeshStandardMaterial into different materials (eg. MeshPhysicalMaterial for glass)

            //HACK: Because THREE's GLTFLoader doesn't seem to be importing alpha from the PrincipledBSDF, I'm writing directives in the name of the material to set the opacity
            //This is absolutely not elegant at all. Please fix this 
            if (material.name.includes('|')) this.ParseAndSetMaterialProperties(material);

            material.envMap = texture;
            material.envMapIntensity = 0.01;
            material.needsUpdate = true;
        } 
    }

    //HACK: This function parses the name of the material with regex and sets the properties accordingly. This is not elegant at all and needs to be fixed later.
    ParseAndSetMaterialProperties(material: THREE.MeshStandardMaterial){
        const regex : RegExp = /\[(.*?)\][\s](.*?);/g;
        const matches : Array<RegExpMatchArray> = Array.from(material.name.matchAll(regex));

        //Go through each property
        for (let match of matches) {
            const propertyName : string = match[1];
            const propertyValue : string = match[2];

            ( material as any )[propertyName] = propertyValue;
        }
    }

}