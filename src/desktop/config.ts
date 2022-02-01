/*
    config.ts

    configuration for the desktop code.
    we access the engine's world object via the Animation function
*/

import anime from 'animejs'; 
import Canvas from '../engine/Canvas'

//JSONs
import desktop_world from './desktop_world.json';
import models from './models.json';

//Behaviours:
import * as b1 from './globalBehaviours/_behaviours'
import * as b2 from './states/index/genericBehaviours/_behaviours'
import * as b3 from './states/index/splash/_behaviours'

//Animations:
import { Animation } from './states/index/StartingAnimation'
 
//Export stuff for index.js to pass into engine
var desktop = {
    //Animation that is called once page is loaded
    PageLoadAnimation: function (canvas: Canvas){
        //Call animation
        anime({
            targets: '#textLayer_upperProgressInfo',
            translateY: [
                    {value: 0, duration: 1000}, //stay in place and avoid any initial jumpiness
                    {value: '-100vh', duration: 1000}
                ],
            easing: 'easeInBack',
            complete: ()=>{
                //Set background color to none so the canvas below the text layer can display
                const textLayer = document.getElementById("textLayer")
                if (textLayer) textLayer.style.backgroundColor = 'transparent';
                canvas.Initialize()
            }
        });
    },

    //Pass our world file into the engine
    world: desktop_world,
    backgroundColor: 0xEE9B00,
    meshes : models,
    behaviours: new Array<{name:string,factory:Function}>().concat(
        b1.behaviours, b2.behaviours, b3.behaviours),
    state_startingAnimations: {
        '/test' : Animation //play this animation when on state.
    }
}

export { desktop };