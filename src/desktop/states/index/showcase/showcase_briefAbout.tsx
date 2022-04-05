import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_briefAbout extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <h3>Welcome!</h3>
                    <p>Welcome to my site! If you keep scrolling, you can see some projects that I am very proud of.</p>
                    <p>If you would like to learn more about me, click the button below. Otherwise, enjoy your stay!</p>
                    <button>About Me</button>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}