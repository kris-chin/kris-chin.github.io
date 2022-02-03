/*
THIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.
*/
import SceneObject from '../../../../engine/SceneObject'
//[BEGIN_BEHAVIOURS]
import showcase_Website from './showcase_Website';
import showcase_MCMC from './showcase_MCMCSE';
//[END_BEHAVIOURS]




var behaviours : {name:string, factory: Function}[] = [
    {
	name: 'showcase_Website',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_Website(parent,params)}
    },
    {
	name: 'showcase_MCMC',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_MCMC(parent,params)}
    }
]

export { behaviours };