
import { translate3d } from './behaviours/DomText';
import World from './World'

export default class ScrollAniamation {

    world: World;

    trigger : boolean; //extend this to a bunch of different values

    constructor(world: World){ //
        this.world = world;
        this.trigger = false;
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
            window.onwheel = this.OnScroll;

            //Set Sticky styling to create our smooth illusion
            let stickyDiv = document.getElementById('sticky');
            if (stickyDiv){
                stickyDiv.style.overflow = 'visible';
                stickyDiv.style.top = '0';
                stickyDiv.style.position = 'sticky';
            }
        }

    }

    //This function is called every time the scroll is touched.
    OnScroll = () => {

        //Only run this code if the trigger was set
        if (this.trigger){
            console.log('hi')
        }

    }


}