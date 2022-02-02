/*
    THIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.
*/
import SceneObject from '../../../../engine/SceneObject'
//[BEGIN_BEHAVIOURS]
import Splash from './Splash';
import SplashOverlay from './SplashOverlay';
//[END_BEHAVIOURS]

var behaviours : {name:string, factory: Function}[] = [
    { 
        name: 'Splash',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new Splash(parent,params)}
    },
    { 
        name: 'SplashOverlay',
        factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new SplashOverlay(parent,params)}
    }
]

export { behaviours };