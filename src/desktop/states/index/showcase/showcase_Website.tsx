import ProjectionText from '../../../../engine/dom/ProjectionText';
import { DomParams } from '../../../../engine/dom/DomText';

export default class showcase_Website extends ProjectionText {

    Render(params: DomParams){
        return(
            <>
                <div className = "showcaseText">
                    <p>Hi</p>
                </div>
            </>
        )
    }
    
}