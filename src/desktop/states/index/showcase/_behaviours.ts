/*
THIS CODE IS GENERATED WITH A SCRIPT. DO NOT EDIT.
*/
import SceneObject from '../../../../engine/SceneObject'
//[BEGIN_BEHAVIOURS]
import showcase_Website from './showcase_Website';
import showcase_MCMC from './showcase_MCMCSE';
import ShowcaseOverlay from './ShowcaseOverlay';
import showcase_briefAbout from './showcase_briefAbout';
import showcase_briefContact from './showcase_briefContact';
import showcase_Pipeline from './showcase_Pipeline';
import showcase_ROP from './showcase_ROP';
import showcase_NetworKING from './showcase_NetworKING';
import Graph from './Graph';
import Graph_Node from './Graph_Node';
import Graph_Link from './Graph_Link';
//[END_BEHAVIOURS]






var behaviours : {name:string, factory: Function}[] = [
    {
	name: 'showcase_Website',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_Website(parent,params)}
    },
    {
	name: 'showcase_MCMC',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_MCMC(parent,params)}
    },
    {
	name: 'ShowcaseOverlay',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new ShowcaseOverlay(parent,params)}
    },
    {
	name: 'showcase_briefAbout',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_briefAbout(parent,params)}
    },
    {
	name: 'showcase_briefContact',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_briefContact(parent,params)}
    },
    {
	name: 'showcase_Pipeline',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_Pipeline(parent,params)}
    },
    {
	name: 'showcase_ROP',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_ROP(parent,params)}
    },
    {
	name: 'showcase_NetworKING',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new showcase_NetworKING(parent,params)}
    },
    {
	name: 'Graph',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new Graph(parent,params)}
    },
    {
	name: 'Graph_Node',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new Graph_Node(parent,params)}
    },
    {
	name: 'Graph_Link',
	factory: (parent : SceneObject|undefined, params:Object|undefined)=>{return new Graph_Link(parent,params)}
    }
]

export { behaviours };