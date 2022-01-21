/*
    Behaviour.ts

    abstract base class to define custom scene object behaviour

*/

import SceneObject from '../SceneObject'


export abstract class Behaviour {

    base : (SceneObject|undefined)

    constructor(base : (SceneObject|undefined)=undefined){
        this.base = base
    }

    abstract Get() : any //If unused, just return null
    abstract Step() : void //if unused, leave blank

}

export default Behaviour