/*
    Behaviour.ts

    abstract base class to define custom scene object behaviour

*/

import SceneObject from '../SceneObject'


export abstract class Behaviour {

    base : SceneObject

    constructor(base : SceneObject){
        this.base = base
    }

    abstract Get() : any //If unused, just return null
    abstract Step() : void //if unused, leave blank

}

export default Behaviour