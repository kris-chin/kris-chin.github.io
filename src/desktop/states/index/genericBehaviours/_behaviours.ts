/*
    THIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.
*/
import SceneObject from '../../../../engine/SceneObject'
//[BEGIN_BEHAVIOURS]
import CubeCircle from './CubeCircle';
import RandomColor from './RandomColor';
import Rotate from './Rotate';
//[END_BEHAVIOURS]

var behaviours : {name:string, factory: Function}[] = [
    { 
        name: 'CubeCircle',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new CubeCircle(parent,params)}
    },
    { 
        name: 'RandomColor',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new RandomColor(parent,params)}
    },
    {
        name: 'Rotate',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new Rotate(parent,params)}
    }
]

export { behaviours };