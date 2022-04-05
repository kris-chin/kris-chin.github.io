import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_ROP extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <h3>ROP Abstraction Script</h3>

                    <p>
                        The last class I had to take for university was a computer security class. The class dealt with low-level cybersecurity concepts, and one
                        project that we were tasked with was to manipulate the control flow of a program via stack buffer overflows to do specific things (reword).
                        
                        NOTE: please reword everything here
                        One of the last tasks of the project was to print a specific string.
                        I couldn't figure out the intended way to do it so I decided to implement a tactic that was only taught in lecture.
                        ROP programming requires looking through the binary for gadgets to do what you want to do.
                        After finding a set of gadgets, I wrote an abstraction that made programming with these gadgets very easily.
                        The script automatically generated a string that could be executed within the overflow.
                        
                    </p>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}