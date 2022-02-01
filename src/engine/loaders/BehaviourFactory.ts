/*
BehaviourFactory.ts

    Since Behaviours must be linked to actual classes, we can't dynamically link them to JSON
    All Behaviours are instantiated in this file and have a "name" value associated with them

    Contains a factory pattern for instantiating new behaviors that are linked to objects

*/

import Behaviour from '../Behaviour';
import SceneObject from '../SceneObject';
import World from '../World'

//Import all Behaviours
import * as b0 from '../dom/_behaviours';

interface BehaviourInterface {
    name: string,
    factory: Function; //returns a behaviour new behaviour object. takes in parent object and parameters
}

export class BehaviourFactory {

    world: World;
    behaviourMap: Map<string, Function >; //map of functions. these functions are all factories

    constructor(world: World){
        this.world = world;
        this.behaviourMap = new Map<string, Function>();

        //First map our engine behaviours
        for (let item of b0.behaviours){
            const b = item as BehaviourInterface;
            this.behaviourMap.set(b.name,b.factory);
        }

        //Then map all of our external behaviours from data
        for (let item of this.world.scene.canvas.data.behaviours){
            const b = item as BehaviourInterface
            this.behaviourMap.set(b.name,b.factory);
        }
    }

    //Returns a newly Instantiated Behaviour Class based on Key Value
    GetBehaviour(key : string, parent : (SceneObject | undefined)=undefined, parameters : (Object | undefined) = undefined) : (Behaviour | undefined) {
        const f = this.behaviourMap.get(key)
        if (f === undefined) {console.error(`Invalid Behaviour: '${key}'`); return undefined}

        //If we have an entry, call it's function and return it's return value
        return ( f.call(this,parent,parameters) as Behaviour)
    }

}

export default BehaviourFactory