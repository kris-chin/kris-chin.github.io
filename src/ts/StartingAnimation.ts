/*
    StartingAnimation.ts

    World.ts calls this class whenever a State has a starting animation
    
*/

import anime from 'animejs'
import World from './World';

export default class StartingAnimation{

    world : World;

    constructor(world: World){
        this.world = world;
    }

    //Pass in a stateName in here and it will play the corresponding animation
    PlayStartingAnimation(stateName: string){
        console.log(`Calling Starting Animation for: '${stateName}'`)

        switch(stateName){
            case('/test'):
                const id = "splashPage"; //shorthand const for the elementId
                var timeline = anime.timeline();
                const statue = this.world.GetSceneObjectById("splashStatue")

                timeline
                .add({ //KRISCHIN
                    targets: `.staggerText`,
                    translateY: ['-200vh', 0],
                    easing: 'easeInOutQuart',
                    delay: anime.stagger(100)
                },0)
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