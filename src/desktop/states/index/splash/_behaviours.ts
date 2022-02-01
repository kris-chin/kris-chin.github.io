import SceneObject from '../../../../engine/SceneObject'

import Splash from './Splash';
import SplashOverlay from './SplashOverlay';

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