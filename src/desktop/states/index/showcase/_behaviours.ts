import SceneObject from '../../../../engine/SceneObject'

import showcase_Website from './showcase_Website';

var behaviours : {name:string, factory: Function}[] = [
    { 
        name: 'showcase_Website',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_Website(parent,params)}
    }
]

export { behaviours };