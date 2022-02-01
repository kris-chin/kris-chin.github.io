/*
    ScrollAnimation.ts

    Class that manages all of the scorlling on the index page and is our main "manager" class

*/


import World from '../../../engine/World'
import ScrollScene from '../../../engine/ScrollScene';

//World Class that manages the actual events
export default class ScrollAnimation {

    world: World;
    private trigger : boolean; //Trigger to determine when to enable scroll. Access with ToggleTrigger()

    //Scroll Animations
    private splash : ScrollScene; //Splash Screne
    private splashLength : number = 100;
    private showcase : ScrollScene; //List of featured projects
    private showcaseLength : number = 100;

    //Height of the page when scroll is enabled
    private heightValue : number = 0; //The height of the 
    private heightUnit : string = 'vh'

    //Variables related to transitioning between ScrollScenes
    private splash_reachedEnd : boolean = false;;
    private showcase_reachedEnd : boolean = false;

    constructor(world: World){ //
        this.world = world;
        this.trigger = false;

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

        //Next, determine the current scene and determine relative percent
        if (!this.splash_reachedEnd) { //if in splash animation
            //Calculate Relative percent
            const startPercent = 0;
            const endPercent = this.splashLength/this.heightValue;
            scroll_percent = ( scroll_percent - startPercent ) / ( endPercent - startPercent )

            //Apply splash animation
            this.splash.ApplyAnimations( scroll_percent )
        }
        else if (!this.showcase_reachedEnd) { //if in showcase
            //Calculate relative percent 
            const startPercent = this.splashLength/this.heightValue;
            const endPercent = 1;
            scroll_percent = ( scroll_percent - startPercent ) / ( endPercent - startPercent )

            //Apply showcase animation
            this.showcase.ApplyAnimations( scroll_percent )

        }
        else { //if at the end
            console.log('youre at the end')
        }
    

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
            x: [-3.6356260858784983, -1.7327148167343331, 1.5502732522091098, -4.246041765496115], 
            y: [1.222035588734489, 1.288332113964421, 0.4986442218209718, 5.918278486200508], 
            z: [4.177402492529296, 4.253729210442213, 2.1509350831563783, -1.3769602257844311] 
        })
        .AddTimeline({
            target: this.world.scene.camera.quaternion,
            _x: [0.006569917698866961, -1.558058946784542e-05, 0.07028842876488238, 0.3144622484565635], 
            _y: [-0.11548248678223165, 0.07580696892721868, 0.4594405797173721, 0.6855137742591262], 
            _z: [0.0007638376980886929, 1.1845257206307469e-06, -0.03650327054684794, 0.4608436985237482], 
            _w: [0.993287495129176, 0.9971225116393221, 0.8846702220206762, -0.46776858074009514] 
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
                keyframes: ['0px', `${window.innerWidth.toString()}px`],
                duration: {startPercent: 0, endPercent: 0.5}
            }
        })
        .AddTimeline({
            target: '#splashOverlay_svg_bottomLine line',
            x2: {
                keyframes: [`${window.innerWidth.toString()}px`, '0px'],
                duration: {startPercent: 0, endPercent: 0.5}
            }
        })
        
    }

    private Showcase(valueIncrement: number) : ScrollScene {
        //Allocate space for our page
        this.heightValue += valueIncrement;

        //If we reached the end, we reached the end
        const toggleEnd = () => {
            if (this.showcase_reachedEnd) return;
            this.showcase_reachedEnd = true;
        }

        //HACK: If you wanna make this scalable, you cant be doing this and referring to the splash var
        const toggleStart = () => {
            if (!this.splash_reachedEnd) return;
            this.splash_reachedEnd = false;
        }

        return new ScrollScene({
            onStart: toggleStart,
            onEnd: toggleEnd
        })
    }



}