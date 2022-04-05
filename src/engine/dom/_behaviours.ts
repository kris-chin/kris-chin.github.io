/*
    THIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.
*/
import SceneObject from '../SceneObject'
//[BEGIN_BEHAVIOURS]
import CameraDebug from './CameraDebug';
import ProjectionText from './ProjectionText';
import ObjectDebug from './ObjectDebug';
//[END_BEHAVIOURS]

var behaviours : {name:string, factory: Function}[] = [
    { 
        name: 'CameraDebug',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new CameraDebug(parent,params)}
    },
    { 
        name: 'ProjectionText',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new ProjectionText(parent,params)}
    },
    {
        name: 'ObjectDebug',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new ObjectDebug(parent,params)}
    }
]

export { behaviours };