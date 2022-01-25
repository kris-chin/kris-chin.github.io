/*
    DomText.tsx

    Behaviour class for creating and manipulating text that is actually inside the DOM.
    Intended to be extended for easier manipulation.

    Contains functions to encapsulate JS animation
    
*/

import Behaviour from "../Behaviour";
import Canvas from '../Canvas';
import TextLayer from '../TextLayer';

export interface DomParams{
    elementId: string
}

export default abstract class DomText extends Behaviour{

    firstRun : boolean = false;
    jsx_element !: JSX.Element; //Point to the text element
    html_element ?: (HTMLElement | null);
    textLayer !: TextLayer; //pointer to text layer
    INTEXTLAYER !: boolean;

    Get(){}

    //This contains the JSX code that is outputted
    abstract Render(params : DomParams) : JSX.Element;
    
    //This is the animation code that is outputted.
    //Do note that this class checks if "this.base" and "this.base.world" exist already. so feel free to do "!."" assumption code
    abstract Animate() : void;

    //Helper function to pushes Element to TextLayer
    private PushElement(){
        const params = this.parameters as DomParams
        //Add Element to textLayer and point to its domObject
        if (params.elementId){
            if (!document.getElementById(params.elementId)){
                this.textLayer!.AddElement(this.jsx_element!, params.elementId);
                this.html_element = document.getElementById(params.elementId);
                if (!this.html_element) console.error("Failed to create HTML Element: %o",this.html_element)
                else this.INTEXTLAYER = true;
            } else {
                console.error(`DOM ElementId: '${params.elementId}' already exists. Not creating duplicate DOMElement`)
            }
        } else {
            console.error("DOM ElementId is required to access DomText. Not Creating DOMElement")
        }
    }

    //Code that is Only ran on First Run
    Init(){
        if (this.base){
            const params = this.parameters as DomParams

            //Point to Text Layer Component
            this.textLayer = (this.base!.world.scene.canvas as Canvas).textLayer

            //Generate Text Component
            this.jsx_element = this.Render(params);

            this.PushElement()
            this.firstRun = true;
        }
    }

    //Update Function
    Step(){
        const params = this.parameters as DomParams
        if (!this.firstRun) this.Init()

        //Display text only if the mesh is being rendered
        if (this.base!.GetRenderState()){ //if rendering
            if (!this.INTEXTLAYER){ //if text is currently not in the DOM
                this.PushElement()//push to text layer
                this.INTEXTLAYER = true;
            }
            //Run Animate Function
            try {
                if (this.base && this.base.world) this.Animate()
                else console.error("Animate function uncalled")
            }
            catch {}

        } else { //if not rendering 
            if (this.INTEXTLAYER) { //if text is in the DOM and it shouldn't be
                this.textLayer.RemoveElement(params.elementId)
                this.INTEXTLAYER = false;
            }
        }
    }

}

//These are helper functions to help animation with the css transform property

//Helper Function for CSS animation. Returns String to be added to main transform function
export function translate3d(args: {x : number, y : number, z: number}, units: string) : string {
    const output : string = `translate3d(${args.x}${units},${args.y}${units},${args.z}${units})`;
    return output
}

//helper Function for CSS animation. Returns String to be added to main transform function
export function rotate3d(args: {x : number, y: number, z: number, a: number}, angle_units: string) : string {
    const output : string = `rotate3d(${args.x},${args.y},${args.z},${args.a}${angle_units})`;
    return output
}
//Helper Function for CSS animation. Returns String to be added to main transform function
export function perspective(args:{amt: number, units: string}): string{
    const output = `perspective(${args.amt}${args.units})`;
    return output
}
//Helper Function for CSS animation. Returns String to be added to main transform function
export function scale3d(args: {x : number, y : number, z: number}): string {
    const output : string = `scale3d(${args.x},${args.y},${args.z}`;
    return output
}