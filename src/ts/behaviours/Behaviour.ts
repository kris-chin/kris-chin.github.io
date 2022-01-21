/*
    Behaviour.ts

    abstract base class to define custom scene object behaviour

*/

import SceneObject from '../SceneObject'


export abstract class Behaviour {

    base : (SceneObject|undefined)
    parameters: (Object|undefined) //Behaviour parameters must fit within an interface for good practice

    constructor(base : (SceneObject|undefined)=undefined, parameters:(Object|undefined)=undefined){
        this.base = base
        this.parameters = parameters
    }

    abstract Get() : any //If unused, just return null
    abstract Step() : void //if unused, leave blank

}

export default Behaviour