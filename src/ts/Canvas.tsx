/*
    Canvas.tsx

    This React Component serves as the bridge between the THREE code and the React code.

    Creates a Scene Class, whose renderer attribute provides a DOM element
*/

//React Imports
import React from 'react';

//THREE Imports
import Scene from './Scene'

//Determine if WebGL is even avaiable
import { WEBGL } from 'three/examples/jsm/WebGL';

import TextLayer from './TextLayer';

import anime from 'animejs';

export interface CanvasProps {
    page : string //"Page" state
}

export default class Canvas extends React.Component {

    textLayer : TextLayer
    scene !: Scene;

    constructor(props : Object){
        super(props)
        //Create the text layer component and point to it
        this.textLayer = new TextLayer(this.props) //Pass the Canvas props to the TextLayer
    }

    //Run when this component is mounted to the DOM
    componentDidMount(): void {
        //Create the Scene Object and wait for World to call onLoadComplete();
        this.scene = new Scene(this); //World loads when this is created
    }

    //Called once the world properly loads
    OnLoadCompete(){
         //Get the DIV Element that this Class Exports
         const element : (HTMLElement | null) = document.getElementById('canvas');
        
         //If canvas was successsfully grabbed
         if (element && element.parentNode){
 
             //Check if WebGL is available
             if (WEBGL.isWebGLAvailable() ) {
                 //Replace the DIV element with a canvas element
                 element.parentNode.replaceChild(this.scene.renderer.domElement, element);
 
                //Start animations and then initialze scene as a callback
                this.PageLoadAnimation()

                 //Add the world for it to render
                 //this.scene.Initialize();
             } else {
                 
                 //Display WebGL Warning
                 const warning = WEBGL.getWebGLErrorMessage();
                 const container : (HTMLElement | null) = document.getElementById( 'container' );
 
                 if (container){
                     container.appendChild( warning );
                 }
             }
         }
    }

    //Return the Div
    render(){
        return(
            <>
                <div id='sticky'>
                    {this.textLayer.render()}
                    <div id='canvas' />
                </div>
            </>
        )
    }

    //Animation that is called once page is loaded
    PageLoadAnimation(){

        //Call animation
        anime({
            targets: '#textLayer_upperProgressInfo',
            translateY: [
                    {value: 0, duration: 1000}, //stay in place and avoid any initial jumpiness
                    {value: '-100vh', duration: 1000}
                ],
            easing: 'easeInBack',
            complete: ()=>{
                //Set background color to none so the canvas below the text layer can display
                const textLayer = document.getElementById("textLayer")
                if (textLayer) textLayer.style.backgroundColor = 'transparent';
            
                //Start Scene
                this.scene.Initialize()

                //Call the current state's Starting Animation
                if (this.scene.world.currentState.worldState.stateSettings.hasStartingAnimation)
                    this.scene.world.startingAnimation.PlayStartingAnimation(this.scene.world.currentState.worldState.name)
            }
        })

    }

}