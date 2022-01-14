/*
Canvas.tsx

This React Component serves as the bridge between the THREE code and the React code.

*/

//React Imports
import React from 'react';

//THREE Imports
import SceneManager from './Scene'

//Determine if WebGL is even avaiable
import { WEBGL } from '../js/WebGL';

export class Canvas extends React.Component {

    //Run when this component is mounted to the DOM
    componentDidMount(): void {
        let canvas = new SceneManager();

        //Get the DIV Element that this Class Exports
        const element : (HTMLElement | null) = document.getElementById('canvas');
        
        //If canvas was successsfully grabbed
        if (element && element.parentNode){

            //Check if WebGL is available
            if (WEBGL.isWebGLAvailable() ) {
                //Replace the DIV element with a canvas element
                element.parentNode.replaceChild(canvas.renderer.domElement, element);

                //Start the scene
                canvas.Initialize()
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
            <div>
                <div id='canvas' />
            </div>
        )
    }

}

export default Canvas;