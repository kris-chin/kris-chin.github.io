/*
    ScrollAnimation.ts

    Class that manages all of the scorlling on the index page and is our main "manager" class

*/


import World from '../../../engine/World'
import ScrollScene from '../../../engine/ScrollScene';
import DebugScroll from '../../globalBehaviours/DebugScroll'

//Entire source config
import config from '../../../config'
import ShowcaseOverlay from './showcase/ShowcaseOverlay';

//Data for showcase projects (loaded externally)
import showcaseData from './showcaseData.json5';

//World Class that manages the actual events
export default class ScrollAnimation {

    world: World;
    private trigger : boolean; //Trigger to determine when to enable scroll. Access with ToggleTrigger()
    private debug : DebugScroll | null = null;
    private showcaseOverlay : ShowcaseOverlay; //we instantiate a showcase overlay on construction and point to it

    //Scroll Animations
    private splash : ScrollScene; //Splash Screne
    private splashLength : number = 100;
    private showcase : ScrollScene; //List of featured projects
    private showcaseLength : number = 900;

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

        //Create a showcase overlay object and point to it for later
        this.showcaseOverlay = this.world.AddObject({key: 'ShowcaseOverlay', state: this.world.GetState()})?.behaviours![0] as ShowcaseOverlay

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
            const endPercent = 1; //leave at 0.75 for now so we can see the scene without messing up camera movement
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

        const tagline = document.getElementById('splashPage_div_tagline')

        const toggleEnd = () => {
            if (tagline) {
                // tagline.style.zIndex = '0';
                tagline.style.pointerEvents = 'none';
            }
            this.splash_reachedEnd = (!this.splash_reachedEnd)
        }

        const onReturn = () => {
            if (tagline) {
                // tagline.style.zIndex = '100';
                tagline.style.pointerEvents = 'auto';
            }
            this.showcaseOverlay.Clear();
        }

        return new ScrollScene({
            onEnd: {enter: toggleEnd, leave: onReturn},
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
            target: '#ShowcaseOverlay_p_sectionTitle',
            translateY: {
                keyframes: ['-1em', '0em'],
                duration: {startPercent: 0.5, endPercent: 1}
            }
        })
        .AddTimeline({
            target: '#showcase_Website div', //The first part of the showcase
            opacity: {
                keyframes: ['0', '1'],
                duration: {startPercent: 0.5, endPercent: 1}
            }
        })
        .AddTimeline({
            target: '.ShowcaseOverlay_div_property p',
            translateX: {
                keyframes: ['5em', '0em'],
                duration: {startPercent: 0.5, endPercent: 1}
            }
        })
        .AddTimeline({
            target: '#ShowcaseOverlay_svg_a',
            translateX: ['-3em', '-3em'],
            translateY: {
                keyframes: ['100vh', '80vh', '0vh'],
                duration: {startPercent:0.3, endPercent:0.7}
            }
        })
        .AddTimeline({
            target: '#ShowcaseOverlay_svg_b',
            translateX: ['-3em', '-3em'],
            translateY: {
                keyframes: ['100vh', '80vh', '0vh'],
                duration: {startPercent:0.4, endPercent:0.8}
            }
        })
        .AddTimeline({
            target: '#ShowcaseOverlay_svg_c',
            translateX: ['-3em', '-3em'],
            translateY: {
                keyframes: ['100vh', '80vh', '0vh'],
                duration: {startPercent:0.5, endPercent:0.9}
            }
        })
        .AddTimeline({
            target: '#ShowcaseOverlay_a_a',
            opacity: {
                keyframes: ['0', '1'],
                duration: {startPercent:0.7, endPercent:0.8}
            }
        })
        .AddTimeline({
            target: '#ShowcaseOverlay_a_b',
            opacity: {
                keyframes: ['0', '1'],
                duration: {startPercent:0.8, endPercent:0.9}
            }
        })
        .AddTimeline({
            target: '#ShowcaseOverlay_a_c',
            opacity: {
                keyframes: ['0', '1'],
                duration: {startPercent:0.9, endPercent:1}
            }
        })
    }

    private Showcase(valueIncrement: number) : ScrollScene {
        //Allocate space for our page
        this.heightValue += valueIncrement;

        //Functions for non-showcase stuff
        const moveTo_splash = () => { //return to the splash scrollscene
            this.showcaseOverlay.Clear()   
            this.splash_reachedEnd = false;   
        }
        const moveTo_aboutBrief = () => { //before the showcases 
            this.showcaseOverlay.Clear();
        }
        const moveTo_contactBrief = () => { //at the end of the showcases
            this.showcaseOverlay.Clear();
        }

        //Set up Showcase Data
        const showcaseMap = new Map<string, {f : Function, n: number}>() //returns a percent depending on string
        const numKeyframes = 7 //number of keyframes in showcase
        var onPercent : any = {} //we add to this object in the for loop
        for (let [i, showcase] of showcaseData.entries()){ //go through json5 data in order
            const percent = (1/numKeyframes) * (i + 1); //add one to account for the first non-showcase project
            showcaseMap.set(showcase.name, {f: () => {this.showcaseOverlay.UpdateSectionData(showcase.data)}, n: percent})

            //apply functions
            var enter = showcaseMap.get(showcase.name)?.f;
            var leave : Function | undefined;

             //if not the first element in the array, define our leave function
            if (showcaseData[i - 1] !== undefined) leave = showcaseMap.get(showcaseData[i-1].name)?.f;
            else leave = (() : Function | undefined => {return moveTo_aboutBrief})(); //leave points to the enter call for the keyframe before the showcases

            onPercent[percent] = {enter: enter, leave: leave};
        }

        //FIXME: There's some extra finnicky stuff in regards to this
        var scene = new ScrollScene({
            onStart: {enter: moveTo_aboutBrief, leave: moveTo_splash},
            onEnd: {enter: moveTo_contactBrief, leave: 
                () => {
                    showcaseMap.get(showcaseData[showcaseData.length-1].name)?.f.call(this)
                }
            },
            onPercent: onPercent
        })
        .AddTimeline({
            target: this.world.scene.camera.position,
            x: [-4.700786932361081, 4.142677689654993, -5.8258712871171845, -3.877690983419306, 17.05432831067018, 27.928882435095296, 25.879418938505957], 
            y: [1.9785631157684191, 1.9934681688817437, 1.806550918384359, 1.532921327152983, 1.363979255504522, 1.6826635304611388, 13.421275042632416], 
            z: [6.185930419974125, 29.948544791807905, 41.89960714019091, 73.17499428994037, 45.5136984907903, 24.51178155817695, -2.1449433315417257]
        })
        .AddTimeline({
            target: this.world.scene.camera.quaternion,
            _x: [-0.020162747554878582, -0.07882852639816365, -0.008136100044118565, -0.0474486902704553, 0.031009362324581152, -0.05930046430671039, -0.05621555008265134], 
            _y: [-0.789190390326181, 0.4617472419059324, 0.9918637645045251, -0.5300612340893563, 0.8669064418473772, -0.5734559569106972, 0.9436800967523422], 
            _z: [-0.025946605413106758, 0.041243353055009147, 0.09009325634414121, -0.029725149886468613, 0.054359480050993336, -0.04167304739671098, 0.23766114265419092], 
            _w: [0.6132689174378438, 0.8825386868840019, 0.08957277320867602, 0.8461088141436147, -0.49452673078442233, 0.8160239442181318, 0.2232148476125619] 
        })
        .AddTimeline({
            target: this.world.scene.controls.target,
            x: [2.2222685048489357, 0.100091171665733, -6.706981089966695, 0.5930996442671232, 21.3245558683708, 32.5837080424348, 23.9065873672659], 
            y: [1.5082746433802394, 1.10733588191635, 0.9056608240040992, 0.9738922802558272, 0.7393838354468736, 0.9597809699631968, 11.053032687239062], 
            z: [7.9505219613602955, 27.14278931162632, 46.73820637480107, 71.00715719086749, 48.03858208547287, 22.835464354010494, 1.791979799234341]
        })

        //Decorate with all of our showcases
        const Website = (scrollScene: ScrollScene) => {
            const p = showcaseMap.get('websiteData')!.n

            scrollScene
            .AddTimeline({
                target: "#showcase_Website div",
                opacity: {
                    keyframes: ['1', '0'],
                    duration: {startPercent: p - (1/numKeyframes), endPercent: p}
                }
            });

            return scrollScene
        }

        const MCMC = (scrollScene: ScrollScene) => {
            const p = showcaseMap.get('mcmcData')!.n
            scrollScene
            .AddTimeline({
                target: "#showcase_MCMC div",
                opacity: {
                    keyframes: ['0', '1'],
                    duration: {startPercent: p - (1/numKeyframes), endPercent: p}
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