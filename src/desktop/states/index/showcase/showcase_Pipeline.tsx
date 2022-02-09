import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_Pipeline extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <p>pipeline</p>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}