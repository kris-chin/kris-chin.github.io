import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_NetworKING extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <h3>NetworKING</h3>

                    <p>
                        This is the first ever Web Application that I ever built. 
                        It started out as a personal program to model my "professional network."
                        Initally built it in Python's matplotlib on a long bus-ride, but I moved it to Angular and Pixi.js.
                        It was the first time I ever built a RESTful API w/ Flask.

                        There are a few choices that I made back then that I would change:
                            -I used SQL for the node data when I should have used NoSQL or GraphQL
                            -I didn't abstract Pixi.JS so it was easier to work with.
                            -The project structure is crap (Backend is not seperated from Frontend)

                        In the future, you may see me completely refactoring this project. I honestly see so much potential in it.
                    </p>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}