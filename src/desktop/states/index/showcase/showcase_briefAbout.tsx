import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_briefAbout extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <p>Brief About</p>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}