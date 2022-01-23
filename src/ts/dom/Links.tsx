import DomText, { DomParams, translate3d, rotate3d} from "../behaviours/DomText";

export default class Links extends DomText{

    Get(){}

    Render(params: DomParams): JSX.Element {

        const testFunc = () => this.base!.world.AddObject('cube',{"pos": {x: 0, y: 0, z: 0}})

        return(
            <div id ="links_body">
                <a onClick={testFunc} id = "links_button1">
                    hi
                </a>
                <button onClick={testFunc} id = "links_button2">
                    son
                </button>
            </div>
        );
    }
    Animate(){
        const a = document.getElementById("links_body")
        if (a) a.style.transform = translate3d({x:window.innerWidth/2,y:window.innerHeight/2,z:0},"px")

        const b = document.getElementById("links_button1")
        if (b) b.style.transform = translate3d({x:-100,y:Math.sin(this.base!.world.time) * 100,z:0},"px")

        const c = document.getElementById("links_button2")
        if (c) c.style.transform = rotate3d({x:1,y:1,z:1,a:this.base!.world.time*10},"rad")
    }

}