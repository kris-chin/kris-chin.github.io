import * as THREE from 'three';

export class Cube extends THREE.Object3D {

    geometry : THREE.BoxGeometry;
    material : THREE.Material;
    mesh : THREE.Mesh;

    constructor(geometry: THREE.BoxGeometry, material: THREE.Material){
        super();

        console.log("CUBE INSTANTIATED")

        //Set up Box Geometry and Material
        //We do this externally to avoid making duplicate geometries and materials
        this.geometry = geometry;
        this.material = material;
  
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    //called every frame
    Step(){
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        //this.mesh.position.y = 0.25 * Math.sin()

    }

}

export default Cube