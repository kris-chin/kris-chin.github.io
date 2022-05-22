/*
    LoopingAnimation.ts
    Behaviour that takes any Animations that a Mesh contains and loops it
*/

import Behaviour from "../../engine/Behaviour";
import * as THREE from 'three';

interface LoopingAnimationParams{
    loop: boolean
}

export default class LoopingAnimation extends Behaviour{

    firstRun : boolean = false;
    animationMixer !: THREE.AnimationMixer;
    clock : THREE.Clock = new THREE.Clock(true);

    Get(){}
    OnDestroy(){}

    Step(){
        const params = this.parameters as LoopingAnimationParams;
        //On first run
        if (!this.firstRun){
            if (this.base === undefined) return;
            if (this.base.innerMesh === undefined) return;
            this.animationMixer = new THREE.AnimationMixer(this.base.innerMesh!)

            console.log('Running animations...')
            //Go through each animationClip and play
            this.base.innerMesh!.animations.forEach( (clip) => {
                const clipAction : THREE.AnimationAction = this.animationMixer.clipAction(clip);
                if (params.loop != false) clipAction.setLoop(THREE.LoopPingPong, Infinity) //Set to loop and pingpong
                //NOTE: In regards to multi-part scenes, do make sure that final keyframes are at the end of the whole animation.
                clipAction.play();
            })

            this.firstRun = true;
        }

        //Every other Run
        this.animationMixer.update(this.clock.getDelta())
    }

}
