import DomText, { DomParams, translate3d} from "../behaviours/DomText";

export default class Links extends DomText{

    Render(params: DomParams): JSX.Element {
        const scene = this.base!.world.scene;

        const testFunc = () => {
            this.base!.world.AddObject('cube',{"pos": {x: 0, y: 0, z: 0}})

            //Change URL
            window.history.pushState('go','','/test/hello')
            scene.MoveCamera(
                {
                    "position": {
                        "x": 4.796629768409727,
                        "y": 1.245790639822066,
                        "z": 2.2894602892092757
                    },
                    "quaternion": {
                        "_x": -0.1328508050039251,
                        "_y": 0.507118024528828,
                        "_z": 0.07946001407237957,
                        "_w": 0.8478608842088454
                    },
                    "orbitTarget": {
                        "x": 0.6025376700085524,
                        "y": -0.2835554238169669,
                        "z": 0.037640561131389236
                    }
                }
                )
        }

        const testFunc2 = () => {
            let cube = this.base?.world.sceneObjects.filter((object)=>(object.name === "ProjectionTextCube"))[0]
            cube?.SetRenderState(!cube.GetRenderState())
        }

        return(
            <div id ="links_body">
                <button onClick={testFunc} id = "links_button1">
                    hi
                </button>
                <button onClick={testFunc2} id = "links_button2">
                    son
                </button>
            </div>
        );
    }
    Animate(){
        const m = window.innerWidth/2

        const a = document.getElementById("links_body")
        if (a) a.style.transform = translate3d({x:m,y:window.innerHeight/2,z:0},"px")

        const b = document.getElementById("links_button1")
        if (b) b.style.transform = translate3d({x:-(m/2),y:Math.sin(this.base!.world.time) * 100,z:0},"px")

        //const c = document.getElementById("links_button2")
        //if (c) c.style.transform = rotate3d({x:1,y:1,z:1,a:this.base!.world.time*10},"rad")
    }

}