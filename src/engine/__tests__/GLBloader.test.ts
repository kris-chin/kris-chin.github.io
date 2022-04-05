import GLBloader from "../loaders/GLBloader";
import * as THREE from 'three';
import World from '../World';

import glbs from '../../desktop/glbs.json5'; 

//Modify the filepaths for the loader for testing
//Note: Because THREE uses fetch to get files, we need to actually set up a dev server
const glbs_alt = () : Array<Object> => {
    return glbs.map( (element : any) => { return {name: element.name, filepath: `http://127.0.0.1:3000${element.filepath}`} })
}

jest.setTimeout(100000)

test('loads GLB files', async () => {
    let map = new Map<string, THREE.Object3D>();
    let loader : GLBloader = new GLBloader(map,{} as World, glbs_alt());
    let data : Map<string, THREE.Object3D>;

    data = await loader.LoadGLBs().
    then( (data) => {return data})

    expect(data.get('website')).toBeDefined();

});
