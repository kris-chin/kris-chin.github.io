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
import { WEBGL } from '../js/WebGL';

import TextLayer from './TextLayer';

export class Canvas extends React.Component {

    textLayer : TextLayer

    constructor(props : Object){
        super(props)
        //Create the text layer component and point to it
        this.textLayer = new TextLayer(this.props)
    }

    //Run when this component is mounted to the DOM
    componentDidMount(): void {

        //Create the Scene Object and point it to this element
        const scene = new Scene(this);

        //Get the DIV Element that this Class Exports
        const element : (HTMLElement | null) = document.getElementById('canvas');
        
        //If canvas was successsfully grabbed
        if (element && element.parentNode){

            //Check if WebGL is available
            if (WEBGL.isWebGLAvailable() ) {
                //Replace the DIV element with a canvas element
                element.parentNode.replaceChild(scene.renderer.domElement, element);

                //Start the scene
                scene.Initialize()
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
                {this.textLayer.render()}
                <div id='canvas' />
            </>
        )
    }

}

export default Canvas;