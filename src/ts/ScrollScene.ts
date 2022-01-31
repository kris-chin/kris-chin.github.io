/*
    ScrolLScene.ts
    
    Handles Computations for scroll interpolation
*/

interface ScrollSceneParams{
    onStart: Function, //callback when starting the scroll
    onEnd: Function, //callback when reaching the end of the scroll
    abovePercent: { [percentage : number] : unknown } //callbacks for on certain percent. Maxes at 2 decimal places
}

interface Timeline {
    target: any,
    params ?: Object,
    //This represents any new property.We treat it as a string.
    //As a note, I just learned that you can reference object propetries like a map/dict. that's crazy.
    [ numericKeys : string ] : unknown
}

interface Keyframes {
    keyframes: any[],
    [ params : string ]: unknown, //casted as KeyframesParams
}

interface KeyframesParams {
    duration: {startPercent: number, endPercent: number} //determines the duration of the animation during scroll
}

const CSSTransformFunctionNames = ['translateX','translateY','translateZ','rotateX','rotateY','rotateZ','scaleX','scaleY','scaleZ']

//Class that manages scroll and keyframe interpolation
//  Every ScrollScene contains multiple timelines
//  Each timeline controls a target and interpolates from a set of keyframes
//  ScrollScenes pre-bake their interpolation on construction
export default class ScrollScene {

    private timelines : Array<Timeline>
    private onEnd : (Function | undefined) = undefined;
    private onStart : (Function | undefined) = undefined;

    private abovePercent : (Array< {value: number, function: Function} > | undefined) = undefined;

    constructor(scrollSceneParams?: Object){
        this.timelines = new Array<Timeline>();
        //Handle params
        const params = scrollSceneParams as ScrollSceneParams;
        if (params && params.onEnd) this.onEnd = params.onEnd;
        if (params && params.onStart) this.onStart = params.onStart;
        if (params && params.abovePercent){ //abovePercent
            const percentages = Object.keys(params.abovePercent)
            this.abovePercent = new Array<{value: number, function: Function}>();
            for (let percent of percentages){
                const p = {value: Number(percent), function: params.abovePercent[Number(percent)] as Function }
                this.abovePercent.push(p) //pushin' p
            }
            //Sort our abovePercent so we can exit early if necessarily
            //Sorts from least to greatest
            this.abovePercent.sort( (firstEl, secondEl)=>{
                if (firstEl.value > secondEl.value) return 1; //sort the first value before the second value
                if (firstEl.value < secondEl.value) return -1; //sort the second value before the first value
                return 0; //sort order stays the same
            })
        }
    }

    //Adds a timeline
    public AddTimeline(timeline: Timeline) : this{
        this.timelines.push(timeline)
        return this //return the scrollscene so you can add another timeline on top of it
    }

    //Interpolates keyframes for every timeline in the ScrollScene
    public ApplyAnimations(scrollPercent: number){

        //Go through every timeline and applt interpolation
        for (let timeline of this.timelines){
            this.InterpolateKeyframes(timeline, scrollPercent);
        }

        //ScrollScene-Specific params
        if ( (scrollPercent === 0) && (this.onStart !== undefined)) this.onStart();
        if ( (scrollPercent === 1) && (this.onEnd !== undefined) ) this.onEnd();
        if ( this.abovePercent !== undefined ){
            (() => { //use arrow syntax so we can use return in if blocks
                
                //Go through all of our percentages and determine if we should call our percent
                for (let entry of this.abovePercent){
                    if (scrollPercent > entry.value)entry.function.call(this)
                    else break; //exit the for loop early
                }

            })();
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
            if (keyName === 'params') { //build timeline params
                continue; //not an unknown key 
            }
                
            //Flags for property type
            var IS_ELEMENT = false; //flag for if we are working with a selected element
            var IS_TRANSFORM = false; //flag for if we are working with a css transform
            var IS_SVG = false; //flag for if we are working with a SVG
            var localPercent = scrollPercent; //we use this for key-by-key animation

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
            var keyframes : (Array<any> | Keyframes); 
            var params : any | undefined;

            if (timeline[keyName] instanceof Array) keyframes = timeline[keyName] as any[]; //if only an array was inputted
            else { //if an array wasn't inputted, we assume it's the Keyframes object
                //Cast our input and get params
                keyframes = (timeline[keyName] as Keyframes).keyframes;
                params = new Object;

                //Go through new keys and build params object
                for (let paramName of Object.keys( (timeline[keyName] as Keyframes)) ){
                    if (paramName === 'values') continue;
                    params[paramName] = (timeline[keyName] as Keyframes)[paramName]
                }

                //Cast params as Keyframesparams
                params = params as KeyframesParams;

                if (params === undefined){
                    console.warn(`Params for '${keyName}' are not defined. If this was intentional, just use an array.`)
                }
            }
            var keyframeType : string;
            
            //Type guard AND an early check to see if every value is a number or string
            if (!keyframes.every( (keyframe)=> {return ( (typeof keyframe === "number") || (typeof keyframe === "string")) }) ) {console.error(`Keyframe array must all be numbers or strings`); continue;}
            else keyframeType = typeof keyframes[0]; //Since all values are homogenous, we can just take the type of the first value for study.
                
            //Guards
            if (keyframes.length < 2) {console.error(`Timeline for '${keyName}' must have more than 1 keyframe`); continue;}
            if (target === undefined) {console.error(`Target for '${keyName}' may not exist`); continue;}
            if (target[keyName] === undefined && (!IS_TRANSFORM) ) {console.error(`Property '${keyName}' may not exist on %o`, target); continue;}

            
            //If we set the duration of the animation, we need to modify the scrollPercent
            if (params && params.duration){
                if (params.duration.startPercent === undefined) {console.error(`[${keyName}] startPercent is undefined`); continue;}
                if (params.duration.endPercent === undefined) {console.error(`[${keyName}] endPercent is undefined`); continue;}

                //Set scrollPercent relative to duration, only if we are past the start percent
                if (scrollPercent >= params.duration.startPercent){
                    localPercent = Math.min( ( (scrollPercent - params.duration.startPercent) / (params.duration.endPercent - params.duration.startPercent) ), 1);
                }
                else{ //if we are not past the scroll percent, we just keep the percent at 0
                    localPercent = 0;
                }
            }

            //Evenly split the distance of keyframes
            //Round upwards so we can actually reach 1 when you add them all together
            const keyFrameDistance : number = Number((1/( keyframes.length - 1)).toFixed(5));
            //Get the current frame of the animation. We keep the decimals 
            const frameNumber : number = localPercent/keyFrameDistance;
            const frameIndex : number = Math.floor(Number(frameNumber));

            //Declare the 'interpolated amount that we want to return
            var amt : any = null;
                
            //Base-Case for calculating our Amount 
            if (keyframes[frameIndex + 1 ] !== undefined){

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
                            break;
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
                            amt = (k0 + distance*relative_percent).toString() + units;

                            break;
                        default: continue;
                    }

                } else { //If we are just dealing with a number amount
                    //Commence Interpolation
                    const distance = keyframes[index1] - keyframes[index0]
                    amt = keyframes[index0] + distance*relative_percent
                }
            } else {
                //Edge-case for reaching the end of the animation
                amt = keyframes[keyframes.length - 1] //assign to last keyframe
            }

            //Now for the good stuff. Set our target's property to the interpolated value
            if (IS_ELEMENT) {

                //Set the target's property to the interpolated value
                if (IS_TRANSFORM){
                    //Check if the transform was already applied prior
                    if ( (target.transform as string).includes(keyName) )  { //since target points to transform (a string), we can check it for our property
                        //Since the transform already contains our property, we need to replace it
                        const transformRegex : RegExp = new RegExp(`((${keyName})\\((.*?)\\))` ); //Selects the first occurance of the CSStransform

                        //Replace the transform
                        target['transform'] = (target.transform as string).replace(transformRegex, `${keyName}(${amt})`)
                    }
                    else {
                        //Since the transform doesn't contain our property, we can just append it
                        target['transform'] += ` ${keyName}(${amt})`
                    }
                }
                else if (IS_SVG) (target as SVGElement).setAttribute(keyName, amt)
                else target[keyName] = amt

            } else { //if our amt was a number
                target[keyName] = amt;
            }

        }
    }
}