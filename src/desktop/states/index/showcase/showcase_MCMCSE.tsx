import ProjectionText from '../../../../engine/dom/ProjectionText';
import { DomParams } from '../../../../engine/dom/DomText';

export default class showcase_MCMC extends ProjectionText {

    Render(params: DomParams){
        return(
            <>
                <div className = "showcaseText">
                    <h3>MCMCSE Python Port</h3>
                    <p>
                        This is a Python port of the R package, MCMCSE.

                        I really like this project because of what I learned.
                        I learned how to integrate C++ with Python.
                        This combination of low-level with high-level languages is very powerful. Especially since the ecosystem for both C++ and Python is huge.
                        This can be used in so many different applications. The possibilities are endless!

                        The build process was automated with CMake and some Shell Scripts.
                    </p>
                </div>
            </>
        )
    }
    
}