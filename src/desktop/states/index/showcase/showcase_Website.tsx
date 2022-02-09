import ProjectionText from '../../../../engine/dom/ProjectionText';
import { DomParams } from '../../../../engine/dom/DomText';

export default class showcase_Website extends ProjectionText {

    Render(params: DomParams){
        return(
            <>
                <div className = "showcaseText">
                    <div>
                        <h3>krischinlayon.com</h3>
                        <p>I'm very proud of this site you are looking at right now</p>
                        <p>Please admire it. I made it in three.js</p>
                        <p>I wrote the scrollin by myself and didn't use a plugin like ScrollMagic.</p>
                        <p>However, I did use anime.js for some of the animations not reliant on scroll position</p>
                    </div>
                </div>
            </>
        )
    }
    
}