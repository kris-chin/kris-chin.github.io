
import World from './World'
import ScrollScene from './ScrollScene';

//World Class that manages the actual events
export default class ScrollAnimation {

    world: World;
    trigger : boolean; //extend this to a bunch of different values

    s : ScrollScene; //test scene

    constructor(world: World){ //
        this.world = world;
        this.trigger = false;

        //Instantiate and test something lol
        this.s = new ScrollScene()
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
                    params: {
                        duration: {startPercent: 0, endPercent: 0.1}
                    }
            },
             opacity: {
                    keyframes: ['1','0'],
                    params: {
                        duration: {startPercent: 0, endPercent: 0.1}
                    }
             }
        })
        .AddTimeline({
            target: '#splashOverlay_svg_topLine line',
            x1: {
                keyframes: ['0px', `${window.innerWidth.toString()}px`],
                params: {
                    duration: {startPercent: 0, endPercent: 0.5}
                }
            }
        })
        .AddTimeline({
            target: '#splashOverlay_svg_bottomLine line',
            x2: {
                keyframes: [`${window.innerWidth.toString()}px`, '0px'],
                params: {
                    duration: {startPercent: 0, endPercent: 0.5}
                }
            }
        })
        

    }

    //Call this function to activate or deactivate scroll link
    ToggleTrigger() {
        this.trigger = (!this.trigger);
        console.log(`Scroll Animation Trigger set to :'${this.trigger}'`);

        //We adjust the root element height and set elements to sticky in order to give the illusion that nothing is moving 
        if (this.trigger){

            //Set the height of the root element, which enables the scrollbar
            const heightValue = '200vh';
            let root = document.getElementById('root');
            if (root) root.style.height = heightValue

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

        //Only run this code if the trigger was set
        if (this.trigger){
            //Returns the Percent of the document scrolled
            const scroll_percent = () => window.scrollY / (document.body.clientHeight - window.innerHeight);
            
            this.s.ApplyAnimations(scroll_percent())
        }

    }


}