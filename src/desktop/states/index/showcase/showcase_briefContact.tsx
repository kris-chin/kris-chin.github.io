import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

//just temporary
import ProjectLinks from '../../../components/ProjectLinks';

export default class showcase_briefContact extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <p>Contact me:</p>
                    <ProjectLinks 
                        { ... {github:"https://www.github.com"} /*I'm not sure why these props have to be like this */ }
                    />
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}