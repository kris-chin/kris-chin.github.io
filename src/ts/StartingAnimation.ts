/*
    StartingAnimation.ts

    World.ts calls this class whenever a State has a starting animation
    
*/

import anime from 'animejs'
import World from './World';
import TextLayer from './TextLayer';

export default class StartingAnimation{

    world : World;
    textLayer : TextLayer

    constructor(world: World){
        this.world = world;
        this.textLayer = this.world.scene.canvas.textLayer;
    }

    //Pass in a stateName in here and it will play the corresponding animation
    PlayStartingAnimation(stateName: string){
        console.log(`Calling Starting Animation for: '${stateName}'`)

        switch(stateName){
            case('/test'):
                const id = "splashPage"; //shorthand const for the elementId of the projectionText
                const id2 = "splashOverlay"; //shorthand const for the elementId of the overlayText
                var timeline = anime.timeline();
                const statue = this.world.GetSceneObjectById("splashStatue")
                timeline
                .add({ //Top Line
                    targets: `#${id2}_svg_topLine line`,
                    x1: [0, 0],
                    x2: [0, window.innerWidth], //NOTE: there's a bug where if you start the screen small and then resize, this doesn't update
                    easing: 'easeInOutQuart'
                },0)
                .add({ //Bottom Line
                    targets: `#${id2}_svg_bottomLine line`,
                    x2: [window.innerWidth, window.innerWidth], //Do be aware that this doesn't update when you resize from small to big
                    x1: [window.innerWidth, 0],
                    easing: 'easeInOutQuart'
                },0)
                .add({ //KRISCHIN
                    targets: `.staggerText`,
                    translateY: ['-200vh', 0],
                    easing: 'easeInOutQuart',
                    delay: anime.stagger(100)
                },300)
                .add({ //CAPTION
                    targets: `#${id}_div_caption`,
                    translateY: ['100vh', 0],
                    easing: 'easeInOutQuart'
                },1600)
                .add({ //Statue
                    targets: statue!.mesh!.scale,
                    x: [0, 0.014],
                    y: [0, 0.014],
                    z: [0, 0.014],
                    easing: 'easeInOutQuart'
                },800*3)
               
                break;

            default:
                console.error(`No Starting Animation defined for '${stateName}'`)
                break;
        }
    }

}