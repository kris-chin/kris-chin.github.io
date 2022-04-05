/*
    LoaderManager.ts
    
    Hosts all Loaders and is repsonsible for updating information regarding loaders.

    Maybe: Maybe use Web Workers to multitask?
*/

import GeometryLoader from './GeometryLoader';
import MaterialLoader from './MaterialLoader';
import KeyObjectLoader from './KeyObjectLoader'
import ExternalMeshLoader from './ExternalMeshLoader';
import GLBloader from './GLBloader';

import World from '../World';

export interface Maps {
    geometries : Map<string,THREE.BufferGeometry> | undefined, //Map of all geometries used
    materials : Map<string,(THREE.Material | Array<THREE.Material>)> | undefined, //Map of all materials used
    keyObjects : Map<string,Object> | undefined, //placeable objects. used for keys
    externalMeshes : Map<string, THREE.Mesh> | undefined,
};

export default class LoaderManager {

    world: World;
    maps: Maps;

    //Loaders
    loader_materials : MaterialLoader;
    loader_geometries : GeometryLoader;
    loader_keyObjects : KeyObjectLoader;
    loader_externalMeshes : ExternalMeshLoader;
    loader_GLBs : GLBloader;

    constructor(world: World, maps: Maps){
        this.world = world;
        this.maps = maps;

        //Pass Maps into loaders
        this.loader_materials = new MaterialLoader(maps.materials!)
        this.loader_geometries = new GeometryLoader(maps.geometries!);
        this.loader_keyObjects = new KeyObjectLoader(maps.keyObjects!);
        //These two loaders share the same map
        this.loader_externalMeshes = new ExternalMeshLoader(maps.externalMeshes!, world, world.scene.canvas.data['meshes']);
        this.loader_GLBs = new GLBloader(maps.externalMeshes!,this.world, this.world.scene.canvas.data['glbs']) 
    }

    async RunLoaders() : Promise<Array<any>> {
        //Load Materials and Geometries asynchroniously. Place objects after promises are all collected
        let data : Array<any> = await Promise.all([
            this.loader_materials.LoadMaterials(),
            this.loader_geometries.LoadGeometries(),
            this.loader_keyObjects.LoadKeyObjects(),
            this.loader_externalMeshes.LoadExternalMeshes(),
            this.loader_GLBs.LoadGLBs()]
        )
        .then((data : Array<any>) => {
            //Update the properties of the materials loaded from the GLBLoader
            this.loader_GLBs.SetMaterialProperties();
            return data;
        });

        return data;
    }
}