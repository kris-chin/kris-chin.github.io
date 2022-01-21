/*
    BehaviourFactory.ts

    Since Behaviours must be linked to actual classes, we can't dynamically link them to JSON
    All Behaviours are instantiated in this file and have a "name" value associated with them

    Contains a factory pattern for instantiating new behaviors that are linked to objects

*/

import Behaviour from './behaviours/Behaviour';
import SceneObject from './SceneObject';

//Import all Behaviours
import Rotate from './behaviours/Rotate';
import RandomColor from './behaviours/RandomColor';

export class BehaviourFactory {

    //Returns a newly Instantiated Behaviour Class based on Key Value
    GetBehaviour(key : string, parent : (SceneObject | undefined)=undefined) : (Behaviour | undefined) {
        switch(key){
            case('Rotate'): return new Rotate(parent);
            case('RandomColor'): return new RandomColor(parent);
            default:
                console.error("Invalid Behaviour: '" + key + "'")
                return undefined
        }
    }

}

export default BehaviourFactory