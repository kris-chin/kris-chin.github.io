
import World from './World'

interface Timeline {
    target: any,
    //This represents any new property.We treat it as a string.
    //As a note, I just learned that you can reference object propetries like a map/dict. that's crazy.
    [ numericKeys : string ] : unknown, 
    params?: Object
}

const CSSTransformFunctionNames = ['translateX','translateY','translateZ','rotateX','rotateY','rotateZ','scaleX','scaleY','scaleZ']

//Class that manages scroll and keyframe interpolation
//  Every ScrollScene contains multiple timelines
//  Each timeline controls a target and interpolates from a set of keyframes
//  ScrollScenes pre-bake their interpolation on construction
export class ScrollScene {

    timelines : Array<Timeline>

    constructor(){
        this.timelines = new Array<Timeline>();
    }

    //Adds a timeline
    public AddTimeline(timeline: Timeline) : this{
        this.timelines.push(timeline)
        return this //return the scrollscene so you can add another timeline on top of it
    }

    //Interpolates keyframes for every timeline in the ScrollScene
    //Note: it's best to pass a scrollPercent that briefly passes 1.
    public ApplyAnimations(scrollPercent: number){

        for (let timeline of this.timelines){
            this.InterpolateKeyframes(timeline, scrollPercent);
        }

    }

    //Given a specific timeline, and a percentage number, do the following:
    //  1. Figure out which keyframe range the percent is in.
    //  2. Determine the Relative position that the percent is between the two keyframes
    //  3. Interpolate the two keyframes and then apply to the timeline's parameters
    private InterpolateKeyframes(timeline: Timeline, scrollPercent : number){

        //Get the timeline object keys
        const keys = Object.keys(timeline)

        //Go through each 'new' key
        for (let keyName of keys){
            //Skip known keys
            if (keyName === 'target') continue; //not an unknown key
            if (keyName === 'params') continue; //not an unknown key

            //Flags for property type
            var IS_ELEMENT = false; //flag for if we are working with a selected element
            var IS_TRANSFORM = false; //flag for if we are working with a css transform
            var IS_SVG = false; //flag for if we are working with a SVG

            //Point target for now. (if this is a css selector, we re-point this)
            var target : any = timeline.target;

            //If target is css selector, we need to get it's object
            if (typeof target === 'string'){
                //Get target based on css selector
                target = document.querySelector(target)
                if (target === null) {console.error(`Failed to get element with selector: '${timeline.target}'`); continue; }
                IS_ELEMENT = true; //set flag to signfiy that we are working with a style

                //Set targetting depending on the type of target
                if (target instanceof SVGElement ) {
                    IS_SVG = true;
                }
                //If A transform function was provided as a property
                else if (CSSTransformFunctionNames.some((testString)=>{ return(testString === keyName)} ) ) {
                    IS_TRANSFORM = true; //set flag
                    target = (target as HTMLElement).style //point to style for now
                } 
                else {
                    target = (target as HTMLElement).style //get style
                }
            }
            
            //Point to the array of keyframes provided in the argument
            const keyframes = timeline[keyName] as any[];
            var keyframeType : string;
            
            //Type guard AND an early check to see if every value is a number or string
            if (!keyframes.every( (keyframe)=> {return ( (typeof keyframe === "number") || (typeof keyframe === "string")) }) ) {console.error(`Keyframe array must all be numbers or strings`); continue;}
            else keyframeType = typeof keyframes[0]; //Since all values are homogenous, we can just take the type of the first value for study.
                
            //Guards
            if (keyframes.length < 2) {console.error(`Timeline for '${keyName}' must have more than 1 keyframe`); continue;}
            if (target === undefined) {console.error(`Target for '${keyName}' may not exist`); continue;}
            if (target[keyName] === undefined && (!IS_TRANSFORM) ) {console.error(`Property '${keyName}' may not exist on %o`, target); continue;}

            //Evenly split the distance of keyframes
            //Round upwards so we can actually reach 1 when you add them all together
            const keyFrameDistance : number = Number((1/( keyframes.length - 1)).toFixed(2));
            //Get the current frame of the animation. We keep the decimals 
            const frameNumber : number = scrollPercent/keyFrameDistance;
            const frameIndex : number = Math.floor(Number(frameNumber));

            //Declare the 'interpolated amount that we want to return
            var amt : number;

            //Interpolate our value
            if (frameIndex >= (keyframes.length - 1) ) amt = keyframes[frameIndex]; //if on last frame, just don't do calculations and use the last frame
            else { 
                //Guards
                if (keyframes[frameIndex + 1 ] === undefined) continue; //Just-in-case error handling for valid array access

                //Get our two keys to interpolate from
                const index0 = frameIndex;
                const index1 = frameIndex + 1

                //Get the position relative to the two keys
                const relative_percent = ( (frameNumber - index0) /  ( index1 - index0) );

                //We do interpolation depending on if the values are strings or numbers
                if (IS_ELEMENT){

                    //Declare our units (this is set later)
                    var units : string;

                    //Because we are working with a css style value, which may or may/not have their values in strings, we have to account for that
                    switch(keyframeType){
                        case "number":
                            console.warn('I didn\'t build handling for pure numbers with CSS units. I know it\ts doable, but please use an array of strings.')
                            continue;
                        case "string":
                            //We may or may not have units attached to this string, so we should split it
                            const regex : RegExp = /(-?\d+)|(\D+)/gi;
                            
                            //Get string arrays
                            var i0 = (keyframes[index0] as string).match(regex); 
                            var i1 = (keyframes[index1] as string).match(regex); 

                            //These string arrays should contain exactly 2 strings (or one if you're not specifying a unit)
                            if (!(i0 && i0.length <= 2 && i0.length > 0)) {console.error(`Invalid CSS Unit input: '${keyframes[index0]}'`); continue;}
                            if (!(i1 && i1.length <= 2 && i1.length > 0)) {console.error(`Invalid CSS Unit input: '${keyframes[index1]}'`); continue;}

                            //Handling for if the units don't match
                            if ( (i0[1] !== i1[1]) ) {console.warn(`Units don't match for '${keyName}'.\nI didn't build conversion code for CSS units. Please just use the same units.`); continue;}
                            
                            //Assign our units
                            units = (i0[1] ?? "");

                            //Convert strings to numbers
                            const k0 = Number(i0[0])
                            const k1 = Number(i1[0])

                            //Do interpolation
                            const distance = k1 - k0;
                            amt = k0 + distance*relative_percent;

                            break;
                        default: continue;
                    }

                    //Set the target's property to the interpolated value
                    if (IS_TRANSFORM){
                        //Check if the transform was already applied prior
                        if ( (target.transform as string).includes(keyName) )  { //since target points to transform (a string), we can check it for our property
                            //Since the transform already contains our property, we need to replace it
                            const transformRegex : RegExp = new RegExp(`((${keyName})\\((.*?)\\))` ); //Selects the first occurance of the CSStransform

                            //Replace the transform
                            target['transform'] = (target.transform as string).replace(transformRegex, `${keyName}(${amt.toString() + units})`)
                        }
                        else {
                            //Since the transform doesn't contain our property, we can just append it
                            target['transform'] += ` ${keyName}(${amt.toString() + units})`
                        }
                    }
                    else if (IS_SVG) (target as SVGElement).setAttribute(keyName, amt.toString() + units)
                    else target[keyName] = amt.toString() + units

                } else {

                    //Commence Interpolation
                    const distance = keyframes[index1] - keyframes[index0]
                    amt = keyframes[index0] + distance*relative_percent

                    //Now for the good stuff. Set our target's property to the interpolated value
                    target[keyName] = amt;

                }

            }
        }
    }
}

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
             translateY: ['0px', '-200px'],
             opacity: ['1','0']
        })
        .AddTimeline({
            target: '#splashOverlay_svg_topLine line',
            x1: ['0px', `${window.innerWidth.toString()}px`]
        })
        .AddTimeline({
            target: '#splashOverlay_svg_bottomLine line',
            x2: [`${window.innerWidth.toString()}px`, '0px']
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