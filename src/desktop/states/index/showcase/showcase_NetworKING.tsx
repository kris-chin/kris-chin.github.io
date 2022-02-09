import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_NetworKING extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <p>NetoworKING</p>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}