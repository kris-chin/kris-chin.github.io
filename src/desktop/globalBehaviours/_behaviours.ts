/*
    THIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.
*/
import SceneObject from '../../engine/SceneObject'
//[BEGIN_BEHAVIOURS]
import AmbientLight from './AmbientLight';
import DirectionalLight from './DirectionalLight';
import DebugScroll from './DebugScroll';
import LoopingAnimation from './LoopingAnimation';
//[END_BEHAVIOURS]



var behaviours : {name:string, factory: Function}[] = [
    { 
        name: 'AmbientLight',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new AmbientLight(parent,params)}
    },
    { 
        name: 'DirectionalLight',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new DirectionalLight(parent,params)}
    },
    {
	name: 'DebugScroll',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new DebugScroll(parent,params)}
    },
    {
	name: 'LoopingAnimation',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new LoopingAnimation(parent,params)}
    }
]

export { behaviours };