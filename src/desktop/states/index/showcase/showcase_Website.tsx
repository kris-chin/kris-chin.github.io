import ProjectionText from '../../../../engine/dom/ProjectionText';
import { DomParams } from '../../../../engine/dom/DomText';

export default class showcase_Website extends ProjectionText {

    Render(params: DomParams){
        return(
            <>
                <div className = "showcaseText">
                    <h3>krischinlayon.com</h3>
                    <p>
                        This site is my most recent project, and the one that I am most proud of.
                            The project uses TypeScript for core logic, three.js for 3D, and anime.js for simple animations.
                            The frontend is styled with SCSS and uses Create React App / React-App-Rewired.
                            Additional automation tools were built with Python.

                        The creation of this site presented some unique problems that I had to solve for myself:

                        Problem: three.js is naturaly low level
                        Solution: Build an engine to abstract a lot of three.js functionality.

                        Problem: The most popular scroll libraries depend on GSAP, and having a second animation library is unecessary.
                        Solution: Build my own scroll library.

                        Problem: Camera Angles and Object definitions were tedius (SPELLCHECK) to add into the engine.
                        Solution: Build external tools in Python to automate the implementation process.

                        Problem: Placing Objects using only coordinates is hard.
                        Solution: Implement my own debug system to modify object coordinates with keys.

                        Problem: Saving Camera Angles for keyframes is hard.
                        Solution: Implement a "snapshot" debug system that saves Camera Angle.
                    </p>
                </div>
            </>
        )
    }
    
}