/*
    StartingAnimation.ts

    World.ts calls this class whenever a State has a starting animation
    
*/

import anime from 'animejs'

export default class StartingAnimation{

    //Pass in a stateName in here and it will play the corresponding animation
    PlayStartingAnimation(stateName: string){
        console.log(`Calling Starting Animation for: '${stateName}'`)

        switch(stateName){
            case('/test'):
                const id = "splashPage"; //shorthand const for the elementId
                anime(
                    {
                        targets: `#${id}_h1_1`,
                        translateY: [-200, 0]
                    }
                );

                break;

            default:
                console.error(`No Starting Animation defined for '${stateName}'`)
                break;
        }
    }

}