import Behaviour from "../../../../engine/Behaviour";
import * as THREE from 'three';

export default class Graph_Node extends Behaviour{

    firstRun : boolean = false;

    Get(){}
    OnDestroy(){}
    Initialize(){

        //Create a new random sphere geometry
        const randomSize : number = (Math.random() * 0.25) + 0.01;
        this.base!.innerMesh!.geometry = new THREE.SphereGeometry(randomSize);

        //I have a feeling this might be expensive
        const randomMaterial : THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color(Math.random(), Math.random(), Math.random())});
        this.base!.innerMesh!.material = randomMaterial;

    }
    Step(){
    }
}