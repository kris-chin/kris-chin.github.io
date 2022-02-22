import GLBloader from "../loaders/GLBloader";
import * as THREE from 'three';
import World from '../World';

import glbs from '../../desktop/glbs.json5'; //TODO: this imports as an empty list.

test('loads GLB files', () => {
    let map = new Map<string, THREE.Object3D>();
    let loader : GLBloader = new GLBloader(map,{} as World, glbs);

    console.log(glbs)

    return loader.LoadGLBs()
    .then(data=> {
        map = data;
        expect(data).toBeInstanceOf( Map );
        expect(map.get('website')).toBeDefined();
    });
});
