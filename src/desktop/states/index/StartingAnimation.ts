/*
    StartingAnimation.ts
    
*/

import anime from 'animejs'
import World from '../../../engine/World';

import SplashScrollAnimation from './splash/SplashScrollAnimation';


export function Animation(world: World){
    const id = "splashPage"; //shorthand const for the elementId of the projectionText
    const id2 = "splashOverlay"; //shorthand const for the elementId of the overlayText
    var timeline = anime.timeline();
    const statue = world.GetSceneObjectById("splashStatue")

    const ani = new SplashScrollAnimation(world); //create a new object that points to scroll

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
    .add({ //KRISCHIN LAYON
        targets: `#${id}_div_name .staggerText`,
        translateY: ['-200vh', 0],
        easing: 'easeInOutQuart',
        delay: anime.stagger(100)
    },0)
    .add({ //CAPTION P1
        targets: `#${id}_p_1`,
        translateY: ['100vh', 0],
        easing: 'easeInOutQuart'
    },'-=500')
    .add({ //CAPTION P2
        targets: `#${id}_p_2`,
        translateY: ['100vh', 0],
        easing: 'easeInOutQuart'
    },'+=0')
    .add({ //Statue
        targets: statue!.mesh!.scale,
        x: [0, 0.014],
        y: [0, 0.014],
        z: [0, 0.014],
        easing: 'easeInOutQuart'
    },'+=5')
    .add({ //Scroll to enter - Turn on opacity
        targets: `#${id2}_div_scrollMessage .staggerText`,
        opacity: [0, 1],
        translateY: [
            {value: '-0.25em', easing: 'easeInOutCubic'},
            {value: '0', easing: 'easeInOutCubic'}
        ],
        delay: anime.stagger(100),
        complete: ()=>{ //Looping ScrollMessage Animation
            anime({ //Scroll to enter - Bounce characters
                targets: `#${id2}_div_scrollMessage .staggerText`,
                translateY: [
                    {value: '-0.25em', duration: 500}, //time to go up
                    {value: '0', duration: 300} //time to go down
                ],
                loop: true,
                delay: anime.stagger(100, {start: 500}),
                easing: 'easeInOutCubic'
            })
            //Activate scroll trigger
            ani.ToggleTrigger();

        }
    }, '-=100')                  
}