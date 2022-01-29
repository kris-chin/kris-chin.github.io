import ProjectionText from './ProjectionText';
import { DomParams, translate3d } from '../behaviours/DomText';

//Helper function that applies a class to every character in a given string
const StaggerText = (text: string) : JSX.Element => {
    var elementArray = new Array<JSX.Element>()
    const className : string = 'staggerText'
    var keyCount = 0;

    for (let c of text){
        elementArray.push(<h1 className={className} key = {keyCount}>{c}</h1>)
        keyCount++;
    }

    return (
        <>
            {elementArray}
        </>
    );
}

export default class Splash extends ProjectionText {

    Render(params : DomParams) : JSX.Element {
        return(
            <>
                <div id={`${params.elementId}_div_tagline`}>
                    <div id={`${params.elementId}_div_name`}>
                        <div id={`${params.elementId}_div_firstName`}> {StaggerText("KRISCHIN")}</div>
                        <div id={`${params.elementId}_div_lastName`}> {StaggerText("LAYON")}</div>
                    </div>
                    <div id={`${params.elementId}_div_caption`}>
                        <p id={`${params.elementId}_p_1`}>22yr. old software engineer based in <span className="highlight1">southern california</span>.</p>
                        <p id={`${params.elementId}_p_2`}><span className="highlight2">Full-Stack Development</span>, <span className="highlight2">Game Development</span>, and <span className="highlight2">Data Engineering</span></p>
                    </div>
                </div>
            </>
        );
    }

    Animate(): void {
        const params = this.parameters as DomParams
        super.Animate(); //Call the Projection text Animation

        //shorthand consts
        //const sX = this.screenX; //x position on screen
        //const sY = this.screenY; //y position on screen
        const iW = window.innerWidth; //width of viewport
        const iH = window.innerHeight; //height of viewport
        
        //Get all of our objects
        const div_tagline = document.getElementById(`${params.elementId}_div_tagline`)
        //const h1_1 = document.getElementById(`${params.elementId}_h1_1`)
        //const p_1 = document.getElementById(`${params.elementId}_p_1`)
        //const p2_2 = document.getElementById(`${params.elementId}_p2_2`)

        //Align our objects
        //NOTE: using sX and sY is good for being responsive for mobile but this has to be a different value once you are moving
        if (div_tagline) div_tagline.style.transform = translate3d({x:0,y:-250,z:0},"px")
    }

}