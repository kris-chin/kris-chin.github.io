import SceneObject from '../SceneObject'

import CameraDebug from './CameraDebug';
import ProjectionText from './ProjectionText';
import ObjectDebug from './ObjectDebug';

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