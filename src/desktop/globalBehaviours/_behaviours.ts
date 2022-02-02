/*
    THIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.
*/
import SceneObject from '../../engine/SceneObject'
//[BEGIN_BEHAVIOURS]
import AmbientLight from './AmbientLight';
import DirectionalLight from './DirectionalLight';
//[END_BEHAVIOURS]

var behaviours : {name:string, factory: Function}[] = [
    { 
        name: 'AmbientLight',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new AmbientLight(parent,params)}
    },
    { 
        name: 'DirectionalLight',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new DirectionalLight(parent,params)}
    }
]

export { behaviours };