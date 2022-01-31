import DomText, { DomParams } from '../behaviours/DomText'

import { ReactComponent as Line } from '../../svg/line.svg';

//Helper function that applies a class to every character in a given string
const StaggerText = (text: string) : JSX.Element => {
    var elementArray = new Array<JSX.Element>()
    const className : string = 'staggerText'
    var keyCount = 0;

    for (let c of text){
        if (c !== " ") elementArray.push(<p className={className} key = {keyCount}>{c}</p>)
        else elementArray.push(<p className={`${className}_space`} key={keyCount}>{c}</p>)
        keyCount++;
    }

    return (
        <>
            {elementArray}
        </>
    );
}


export default class SplashOverlay extends DomText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <Line id={`${params.elementId}_svg_topLine`} width={window.innerWidth} />
                <Line id={`${params.elementId}_svg_bottomLine`} width={window.innerWidth} />
                <div id={`${params.elementId}_div_scrollMessage_wrapper`}>
                    <div id={`${params.elementId}_div_scrollMessage`}>
                        {StaggerText("scroll to enter")}
                    </div>
                </div>
            </>
        );
    }

    Animate(): void {}

}