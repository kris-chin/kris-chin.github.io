//An object with this behaviour is added by ScrollAnimation.

import DomText, { DomParams } from '../../engine/dom/DomText'

export default class DebugScroll extends DomText{

    Render(params: DomParams): JSX.Element {

        return(
            <>
                <p id={`${params.elementId}_warn`}>DEBUG SCROLL</p>
                <p id={`${params.elementId}_total`}>Total: </p>
                <p id={`${params.elementId}_current`}>Current: </p>
            </>
        );
    }

    Animate(): void {}

    //Called by ScrollAnimation when scroll is updated
    Update_Text(totalPercent: number, currentPercent: number){
        const params = this.parameters as DomParams
        const total = document.getElementById(`${params.elementId}_total`)
        const current = document.getElementById(`${params.elementId}_current`)

        if (total) total.innerHTML = `Total: ${totalPercent.toFixed(2)}`
        if (current) current.innerHTML = `Current: ${currentPercent.toFixed(2)}`
    }

}