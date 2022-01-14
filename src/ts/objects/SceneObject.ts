/*
SceneObject.ts

Base Wrapper Class for all objects. Adds some extra functions needed for engine-related purposes.
Extend your objects from this instead of THREE.Object3D. 

*/

import * as THREE from 'three';

export abstract class SceneObject extends THREE.Object3D {

    mesh! : THREE.Mesh; //Code assumes Mesh will be initalized by the time the class is used

    //Called every frame
    Step(){}

}

export default SceneObject