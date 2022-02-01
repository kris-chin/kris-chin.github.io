import SceneObject from '../../engine/SceneObject'

import AmbientLight from './AmbientLight';
import DirectionalLight from './DirectionalLight';

var behaviours : {name:string, factory: Function}[] = [
    { 
        name: 'AmbientLight',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new AmbientLight(parent,params)}
    },
    { 
        name: 'DirectionalLight',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new DirectionalLight(parent,params)}
    },
]

export { behaviours };