import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_briefContact extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <p>brief contact</p>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}