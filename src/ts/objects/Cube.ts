import * as THREE from 'three';
import SceneObject from './SceneObject'
import World from '../World';

export class Cube extends SceneObject {

    geometry : THREE.BoxGeometry;
    material : THREE.Material;
    mesh : THREE.Mesh;

    constructor(geometry: THREE.BoxGeometry, material: THREE.Material){
        super();

        //Set up Geometry and Material
        //We do this externally to avoid making duplicate geometries and materials
        this.geometry = geometry;
        this.material = material;
  
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    //called every frame
    Step(){
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.mesh.position.y += 0.01 * Math.sin((<World>this.parent).time)

    }

}

export default Cube