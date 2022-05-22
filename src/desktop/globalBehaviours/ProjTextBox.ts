/*
    ProjTextBox.tsx

    This behaviour takes in a string that determines what text to display in a ProjectionText

*/
import { DomParams } from '../../engine/dom/DomText';
import ProjectionText  from '../../engine/dom/ProjectionText'
import JSXMap from '../data_jsx/JSXMap';

export interface  ProjTextBoxParams {
    JSXKey: string 
} 

export default class ProjTextBox extends ProjectionText{

    Render(): JSX.Element {
        const proj_params = this.parameters as ProjTextBoxParams;
        
        //Get JSX Element by pulling JSXElementKey
        const map: Map<string, JSX.Element> = JSXMap.call(this);
        const element: JSX.Element | undefined = map.get(proj_params.JSXKey);
        
        if (element === undefined) console.error(`Invalid JSX Key: '${proj_params.JSXKey}'`);

        //Set the elementId because every DomText needs an elementID
        (this.parameters as DomParams).elementId = proj_params.JSXKey;

        return element!;
    }

    Animate(): void {
        super.Animate();
    }

}