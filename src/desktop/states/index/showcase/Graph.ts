import Behaviour from "../../../../engine/Behaviour";
import SceneObject from "../../../../engine/SceneObject";
import Graph_Link from "./Graph_Link";
import Graph_Node from "./Graph_Node";

export default class Graph extends Behaviour{

    firstRun : boolean = false;

    Get(){}
    OnDestroy(){}

    OnStart(){
        const pos = this.base?.innerMesh?.position!;
        const baseNode : Graph_Node = this.CreateNode(pos,this.base!);

        for (let i = 0; i < 10; i++){

            //Generate a random position for our new node
            const randomAmt = () => (0.5 - Math.random()) * 5;
            const randomPos = () => {return {x: randomAmt(), y: randomAmt(), z: randomAmt()}}
            
            const newNode : Graph_Node = this.CreateNode(randomPos(),this.base!);
            this.LinkNode(baseNode, newNode);

            //for the new node, create 2 nodes that stem from it
            for (let j = 0; j < 2; j++){
                const newNode2 : Graph_Node = this.CreateNode(randomPos(), newNode.base!)
                this.LinkNode(newNode, newNode2);
            }

        }
    }

    Step(){

        //code for firstRun 
        if (!this.firstRun){
            this.OnStart()
            this.firstRun = true;
        }

    }

    //Creates a new node mesh
    //The node's location is in a random location in a given range from the callee
    CreateNode(pos: {x:number, y:number, z:number}, parent: SceneObject): Graph_Node{
        //Create Respective Objects
        const node_sceneObject: SceneObject = this.base?.world.AddObject({key: "Graph_Node", state: this.base.world.GetState()}, {'pos': pos, 'parent': parent})!
        const node : Graph_Node | null = node_sceneObject.FindBehaviour(Graph_Node) as Graph_Node;

        node.Initialize();

        return node;
    }

    //Creates a Link Mesh and Links it to two given nodes
    LinkNode(node1: Graph_Node, node2: Graph_Node): Graph_Link{
        const link_sceneObject: SceneObject = this.base?.world.AddObject({key: "Graph_Link", state: this.base.world.GetState()}, {'parent': this.base})!
        const link : Graph_Link | null = link_sceneObject.FindBehaviour(Graph_Link) as Graph_Link;

        link.Node1 = node1;
        link.Node2 = node2;

        link.Initialize();

        return link;
    }

}