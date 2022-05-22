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

export interface CanvasProps {
    page : string //"Page" state,
    data : any //all data
    config: any//config
}

export default class Canvas extends React.Component {

    textLayer : TextLayer
    PageLoadAnimation : (Function | undefined) = undefined;
    scene !: Scene;
    data : any; //contains all data (passed as prop)
    config : any; //contains configuration

    constructor(props : Object){
        super(props)
        //Create the text layer component and point to it
        this.textLayer = new TextLayer(this.props) //Pass the Canvas props to the TextLayer

        //Load data as prop
        this.data = (this.props as CanvasProps).data
        this.config = (this.props as CanvasProps).config
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
                this.data.PageLoadAnimation.call(this,this);

                 //Add the world for it to render
                 //this.Initialize();
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

    //Initialize canvas and call starting animation if needed
    Initialize(){
        //Start Scene
        this.scene.Initialize()

        //Call the current state's Starting Animation
        if (this.scene.world.currentState.worldState.stateSettings.hasStartingAnimation)
                (this.data.state_startingAnimations[`${(this.props as CanvasProps).page}`] as Function).call(this, this.scene.world)

    }

    //Return the Div
    render(){
        return(
            <>
                <div id='site-wrapper'>
                    {this.textLayer.render()}
                    <div id='canvas' />
                </div>
            </>
        )
    }
}