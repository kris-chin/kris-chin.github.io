//React Imports
import React from 'react';

//THREE Imports
import SceneManager from './SceneManager'

export class Canvas extends React.Component {

    //Run when this component is mounted to the DOM
    componentDidMount(): void {
        let canvas = new SceneManager();

        //Get the DIV Element that this Class Exports and replace it with a canvas element
        const element : (HTMLElement | null) = document.getElementById('canvas');
        
        //If canvas was successsfully grabbed
        if (element && element.parentNode){
            element.parentNode.replaceChild(canvas.renderer.domElement, element);
            //Start the scene
            canvas.Initialize()
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