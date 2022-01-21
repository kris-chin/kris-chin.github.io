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
import CubeCircle from './behaviours/CubeCircle';
import DirectionalLight from './behaviours/DirectionalLight'; //note: this shares the same name as the directional light from THREE
import AmbientLight from './behaviours/AmbientLight';

export class BehaviourFactory {

    //Returns a newly Instantiated Behaviour Class based on Key Value
    GetBehaviour(key : string, parent : (SceneObject | undefined)=undefined, parameters : (Object | undefined) = undefined) : (Behaviour | undefined) {
        switch(key){
            case('Rotate'): return new Rotate(parent,parameters);
            case('RandomColor'): return new RandomColor(parent,parameters);
            case('CubeCircle'): return new CubeCircle(parent,parameters);
            case('DirectionalLight'): return new DirectionalLight(parent,parameters);
            case('AmbientLight'): return new AmbientLight(parent, parameters);
            default:
                console.error("Invalid Behaviour: '" + key + "'")
                return undefined
        }
    }

}

export default BehaviourFactory