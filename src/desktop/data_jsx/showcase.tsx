import JSXData from "./JSXDataInterface";
import ProjectLinks from "../components/ProjectLinks";

export var data = [
    /* ------------------------------ Brief About ----------------------------- */
    new JSXData('briefAbout_box1',
        <>
            <div className = {`briefAbout showcaseText`}>
                <h3>Welcome!</h3>
                <p>Welcome to my site! If you keep scrolling, you can see some projects that I am very proud of.</p>
                <p>If you would like to learn more about me, click the button below. Otherwise, enjoy your stay!</p>
                <button>About Me</button>
            </div>
        </>
    ),
    /* ----------------------- Project 1: Personal Website ---------------------- */
    new JSXData('website_box1',
        <>
            <div className = {`website showcaseText`}>
                <h3>krischinlayon.com</h3>
                <p>
                    This site is my most recent project, and the one that I am most proud of.
                    The project uses TypeScript for core logic, three.js for 3D, and anime.js for simple animations.
                    The frontend is styled with SCSS and uses Create React App / React-App-Rewired.
                    Additional automation tools were built with Python.
                </p>
            </div>
        </>
    ),

    new JSXData('website_box2',
        <>
            <div className = {`website showcaseText`}>
                <p>
                   The creation of this site presented some unique problems that I had to solve for myself:

                    Problem: three.js is naturaly low level
                    Solution: Build an engine to abstract a lot of three.js functionality.

                    Problem: The most popular scroll libraries depend on GSAP, and having a second animation library is unecessary.
                    Solution: Build my own scroll library.
                </p>
            </div>
        </>
    ),

    new JSXData('website_box3',
        <>
            <div className = {`website showcaseText`}>
                <p>
                    Problem: Camera Angles and Object definitions were tedius (SPELLCHECK) to add into the engine.
                    Solution: Build external tools in Python to automate the implementation process.

                    Problem: Placing Objects using only coordinates is hard.
                    Solution: Implement my own debug system to modify object coordinates with keys.

                    Problem: Saving Camera Angles for keyframes is hard.
                    Solution: Implement a "snapshot" debug system that saves Camera Angle.
                </p>
            </div>
        </>
    ),
    /* ---------------------------- Project 2: MCMCSE --------------------------- */
    new JSXData('mcmcse_box1', 
        <>
            <div className = {`mcmcse showcaseText`}>
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
    ),

    new JSXData('mcmcse_box2',
        <>
            <div className = {`mcmcse projTextBox`}>

            </div>
        </>
    ),
    /* --------------------------- Project 3: Pipeline -------------------------- */
    new JSXData('pipeline_box1',
        <>
            <div className = {`pipeline showcaseText`}>
                <h3>Artist-Analytics Pipeline</h3>
                <p>
                    As someone who releases music, one thing that has bothered me was the lack of homogeneity and insight provided by
                    analytics provided to you by Distributors and Platforms such as Distrokid and Spotify respectively.
                    This is a modular data pipeline that allows for the concatination of multiple artist-analytics datasets.
                </p>
            </div>
        </>
    ),
    new JSXData('pipeline_box2',
        <>
            <div className = {`pipeline showcaseText`}>
                <p>
                    The pipeline was built entirely with Python Pandas.
                    Transformation and calculation tools are to be built in R.
                </p> 
            </div>
        </>
    ),
    /* ----------------------------- Project 4: ROP ----------------------------- */
    new JSXData('rop_box1',
        <>
            <div className = {`rop showcaseText`}>
                <h3>ROP Abstraction Script</h3>
                <p>
                    The last class I had to take for university was a computer security class. The class dealt with low-level cybersecurity concepts, and one
                    project that we were tasked with was to manipulate the control flow of a program via stack buffer overflows to do specific things (reword).
                </p>
            </div>
        </>
    ),
    new JSXData('rop_box2',
        <>
            <div className = {`rop showcaseText`}>
                <p>
                    One of the last tasks of the project was to print a specific string.
                    I couldn't figure out the intended way to do it so I decided to implement a tactic that was only taught in lecture.
                    ROP programming requires looking through the binary for gadgets to do what you want to do.
                    After finding a set of gadgets, I wrote an abstraction that made programming with these gadgets very easily.
                    The script automatically generated a string that could be executed within the overflow.
                </p>
            </div>
        </>
    ),
    /* -------------------------- Project 5: NetworKING ------------------------- */
    new JSXData('networking_box1',
        <>
            <div className = {`networking showcaseText`}>
                <h3>NetworKING</h3>
                <p>
                    This is the first ever Web Application that I ever built. 
                    It started out as a personal program to model my "professional network."
                    Initally built it in Python's matplotlib on a long bus-ride, but I moved it to Angular and Pixi.js.
                    It was the first time I ever built a RESTful API w/ Flask.

                </p>
            </div>
        </>
    ),
    new JSXData('networking_box2',
        <>
            <div className = {`networking showcaseText`}>
                <p>
                    There are a few choices that I made back then that I would change:
                        -I used SQL for the node data when I should have used NoSQL or GraphQL
                        -I didn't abstract Pixi.JS so it was easier to work with.
                        -The project structure is crap (Backend is not seperated from Frontend)
                    In the future, you may see me completely refactoring this project. I honestly see so much potential in it.
                </p>
            </div>
        </>
    ),
    /* ------------------------------ Brief Contact ----------------------------- */
    new JSXData('briefContact_box1',
        <>
            <div className = {`briefContact showcaseText`}>
                <p>Contact me:</p>
                <ProjectLinks 
                    { ... {github:"https://www.github.com"} /*I'm not sure why these props have to be like this */ }
                />
            </div>
        </>
    )
]