import Behaviour from "../../../../engine/Behaviour";
import Graph_Node from "./Graph_Node";
import * as THREE from 'three';

export default class Graph_Link extends Behaviour{

    firstRun : boolean = false;

    Node1!: Graph_Node;
    Node2!: Graph_Node;

    lineGeometry!: THREE.Line;

    Get(){}
    OnDestroy(){}
    Initialize(){
        //Get the world positions of these objects because they may be nested 
        let pos1 : THREE.Vector3 = new THREE.Vector3();
        let pos2 : THREE.Vector3 = new THREE.Vector3();
        this.Node1.base!.mesh!.getWorldPosition(pos1);
        this.Node2.base!.mesh!.getWorldPosition(pos2);

        const points : THREE.Vector3[] = [
            pos1, pos2
        ];
        //Create a new Line Geometry that links to the two nodes
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1 // this usually defaults to 1 regardless..
        });

        this.lineGeometry = new THREE.Line(lineGeometry,lineMaterial);
        //I think this is kinda messy, since the line isn't neatly organized into a group object3d.
        this.base!.world.add(this.lineGeometry)

    }
    Step(){
        //Always keep the x1y1 and the x2y2 on the locations of the nodes
    }

}