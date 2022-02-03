/*
    ScrollAnimation.ts

    Class that manages all of the scorlling on the index page and is our main "manager" class

*/


import World from '../../../engine/World'
import ScrollScene from '../../../engine/ScrollScene';
import DebugScroll from '../../globalBehaviours/DebugScroll'

//Entire source config
import config from '../../../config'

//World Class that manages the actual events
export default class ScrollAnimation {

    world: World;
    private trigger : boolean; //Trigger to determine when to enable scroll. Access with ToggleTrigger()
    private debug : DebugScroll | null = null;

    //Scroll Animations
    private splash : ScrollScene; //Splash Screne
    private splashLength : number = 100;
    private showcase : ScrollScene; //List of featured projects
    private showcaseLength : number = 300;

    //Height of the page when scroll is enabled
    private heightValue : number = 0; //The height of the 
    private heightUnit : string = 'vh'

    //Variables related to transitioning between ScrollScenes
    private splash_reachedEnd : boolean = false;;
    private showcase_reachedEnd : boolean = false;

    constructor(world: World){ //
        this.world = world;
        this.trigger = false;

        //Add a debug object if enabled
        if (config.SHOW_SCROLL) {
            const debugObject = this.world.AddObject({key:'DebugScroll', state: this.world.GetState()})
            if (debugObject) this.debug = debugObject.behaviours![0] as DebugScroll
        }

        //Point to different scroll Animiations
        this.splash = this.SplashScreen(this.splashLength);
        this.showcase = this.Showcase(this.showcaseLength); //NOTE: if there's another scroll ani after this, you gotta move some functions


    }

    //Call this function to activate or deactivate scroll link
    ToggleTrigger() {
        this.trigger = (!this.trigger);
        console.log(`Scroll Animation Trigger set to :'${this.trigger}'`);

        //We adjust the root element height and set elements to sticky in order to give the illusion that nothing is moving 
        if (this.trigger){

            //Set the height of the root element, which enables the scrollbar
            let root = document.getElementById('root');
            if (root) root.style.height = this.heightValue.toString() + this.heightUnit;

            //Add an event handler to call the scroll command
            window.onscroll = this.OnScroll;

            //Set Sticky styling to create our smooth illusion
            let stickyDiv = document.getElementById('site-wrapper');
            if (stickyDiv){
                stickyDiv.style.overflow = 'visible';
                stickyDiv.style.top = '0';
                stickyDiv.style.position = 'fixed'; //this is fixed instead of sticky because we don't need more standard DOM text afterwards.
            }
        }

    }

    //This function is called every time the mouseScroll is done
    OnScroll = () => {
        if (!this.trigger) return; //Only run this code if the trigger was set

        //First get the percent of the document scrolled
        var scroll_percent = (window.scrollY / (document.body.clientHeight - window.innerHeight) );
        var local_percent = 1;

        //Next, determine the current scene and determine relative percent
        if (!this.splash_reachedEnd) { //if in splash animation
            //Calculate Relative percent
            const startPercent = 0;
            const endPercent = this.splashLength/this.heightValue;
            local_percent = ( scroll_percent - startPercent ) / ( endPercent - startPercent )

            //Apply splash animation
            this.splash.ApplyAnimations( local_percent, config.SCROLL_SNAP)
        }
        else if (!this.showcase_reachedEnd) { //if in showcase
            //Calculate relative percent 
            const startPercent = this.splashLength/this.heightValue;
            const endPercent = 0.75; //leave at 0.75 for now so we can see the scene without messing up camera movement
            local_percent = ( scroll_percent - startPercent ) / ( endPercent - startPercent )

            //Apply showcase animation
            this.showcase.ApplyAnimations( local_percent, config.SCROLL_SNAP)

        }
        else { //if at the end
            console.log('youre at the end')
        }
    
        if (this.debug) this.debug.Update_Text(scroll_percent, local_percent)
    }

    //Animations
    //=======================================================================================
    private SplashScreen(valueIncrement: number) : ScrollScene {
        //Allocate space for our page
        this.heightValue += valueIncrement;

        const toggleEnd = () => {
            this.splash_reachedEnd = (!this.splash_reachedEnd)
        }

        return new ScrollScene({
            onEnd: toggleEnd,
        })
        .AddTimeline({
            target: this.world.scene.camera.position,
            x: [-3.6356260858784983, -4.1311087651639085, -4.700786932361081], 
            y: [1.222035588734489, 1.1934647924875004, 1.9785631157684191], 
            z: [4.177402492529296, 6.279471167283809, 6.185930419974127] 
        })
        .AddTimeline({
            target: this.world.scene.camera.quaternion,
            _x: [0.006569917698866961, 0.00656991769886696, -0.020162747554878593], 
            _y: [-0.11548248678223165, -0.11548248678223165, -0.7891903903261809], 
            _z: [0.0007638376980886929, 0.0007638376980886929, -0.025946605413106755], 
            _w: [0.993287495129176, 0.993287495129176, 0.613268917437844] 
        })
        .AddTimeline({
            target: this.world.scene.controls.target,
            x: [-2.4886031691145027, -2.4886031691145027, 2.2222685048489357], 
            y: [1.288175858446346, 1.288175858446346, 1.5082746433802394], 
            z: [-0.688803821750932, -0.688803821750932, 7.9505219613602955]
        })
        .AddTimeline({
             target: '#splashOverlay_div_scrollMessage',
             translateY: {
                    keyframes: ['0px', '-20px'],
                    duration: {startPercent: 0, endPercent: 0.1}
            },
             opacity: {
                    keyframes: ['1','0'],
                    duration: {startPercent: 0, endPercent: 0.1}
             }
        })
        .AddTimeline({
            target: '#splashOverlay_svg_topLine line',
            x1: {
                keyframes: [`${(window.innerWidth*0.05).toFixed(0)}px`, `${(window.innerWidth*0.95).toFixed(0)}px`],
                duration: {startPercent: 0, endPercent: 0.5}
            },
            y1: {
                keyframes: ['0px', `${(window.innerHeight*0.90).toFixed(0)}px`],  
                duration: {startPercent: 0.5, endPercent: 1}
            },
            'stroke-width': {
                keyframes: ['5', '3'],
                duration: {startPercent: 0, endPercent: 0.5}
            }
        })
        .AddTimeline({
            target: '#splashOverlay_svg_bottomLine line',
            x2: {
                keyframes: [`${(window.innerWidth*0.95).toFixed(0)}px`, `${(window.innerWidth*0.05).toFixed(0)}px`],
                duration: {startPercent: 0, endPercent: 0.5}
            },
            y1: {
                keyframes: ['0px', `${(window.innerHeight*0.90).toFixed(0)}px`], 
                duration: {startPercent: 0.5, endPercent: 1}
            },
            'stroke-width': {
                keyframes: ['5', '3'],
                duration: {startPercent: 0, endPercent: 0.5}
            }
        })
        .AddTimeline({
            target: '#splashOverlay_svg_bottomLine', //Animate the bottom line's transform because we can't have negative length for SVG
            translateY: {
                keyframes: ['95vh', '5vh'],
                duration: {startPercent: 0.5, endPercent: 1}
            }
        })
        .AddTimeline({
            target: '#splashPage_div_firstName',
            translateY: {
                keyframes: ['0vh', '-100vh'],
                duration: {startPercent: 0, endPercent: 0.5}
            },
            opacity: {
                keyframes: ['1', '0'],
                duration: {startPercent: 0, endPercent: 0.25}
            }
        })
        .AddTimeline({
            target: '#splashPage_div_lastName',
            translateY: {
                keyframes: ['0vh', '100vh'],
                duration: {startPercent: 0, endPercent:0.5}
            },
            opacity: {
                keyframes: ['1', '0'],
                duration: {startPercent: 0, endPercent: 0.25}
            }
        })
        .AddTimeline({
            target: '#splashPage_p_1',
            translateX: {
                keyframes: ['0vw', '-100vw'],
                duration: {startPercent: 0, endPercent: 0.5}
            },
            opacity: {
                keyframes: ['1', '0'],
                duration: {startPercent: 0, endPercent: 0.25}
            }
        })
        .AddTimeline({
            target: '#splashPage_p_2',
            translateX: {
                keyframes: ['0vw', '100vw'],
                duration: {startPercent: 0, endPercent: 0.5}
            },
            opacity: {
                keyframes: ['1', '0'],
                duration: {startPercent: 0, endPercent: 0.25}
            }
        })
        .AddTimeline({
            target: '#showcase_Website div', //The first part of the showcase
            opacity: {
                keyframes: ['0', '1'],
                duration: {startPercent: 0.5, endPercent: 1}
            }
        })
    }

    private Showcase(valueIncrement: number) : ScrollScene {
        //Allocate space for our page
        this.heightValue += valueIncrement;

        //If we reached the end, we reached the end
        const toggleEnd = () => {
            // if (this.showcase_reachedEnd) return;
            // this.showcase_reachedEnd = true;
        }

        //HACK: If you wanna make this scalable, you cant be doing this and referring to the splash var
        const toggleStart = () => {
            if (!this.splash_reachedEnd) return;
            this.splash_reachedEnd = false;
        }

        var scene = new ScrollScene({
            onStart: toggleStart,
            onEnd: toggleEnd
        })
        .AddTimeline({
            target: this.world.scene.camera.position,
            x: [-4.700786932361081, 5.601202127479064], 
            y: [1.9785631157684191, 2.886787063749276], 
            z: [6.185930419974125, 22.88632882073922] 
        })
        .AddTimeline({
            target: this.world.scene.camera.quaternion,
            _x: [-0.020162747554878582, -0.05756302537890129], 
            _y: [-0.789190390326181, 0.8524111447864626], 
            _z: [-0.025946605413106758, 0.09607174520658653], 
            _w: [0.6132689174378438, 0.5107366817901575] 
        })
        .AddTimeline({
            target: this.world.scene.controls.target,
            x: [2.2222685048489357, 1.302927534462396], 
            y: [1.5082746433802394, 1.7738653148592478], 
            z: [7.9505219613602955, 25.18551143720863]
        })

        //Decorate with all of our showcases
        const Website = (scrollScene: ScrollScene) => {
            scrollScene
            .AddTimeline({
                target: "#showcase_Website div",
                opacity: {
                    keyframes: ['1', '0'],
                    duration: {startPercent: 0.5, endPercent: 1}
                }
            });

            return scrollScene
        }

        const MCMC = (scrollScene: ScrollScene) => {
            scrollScene
            .AddTimeline({
                target: "#showcase_MCMC div",
                opacity: {
                    keyframes: ['0', '1'],
                    duration: {startPercent: 0.5, endPercent: 1}
                }
            })
            return scrollScene
        }


        //Add all of our showscases to the scene
        scene = Website(scene)
        scene = MCMC(scene)

        return scene;
    }

}