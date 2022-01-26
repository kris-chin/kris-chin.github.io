import DomText, { DomParams, translate3d} from "../behaviours/DomText";

export default class Links extends DomText{

    Render(params: DomParams): JSX.Element {
        //const scene = this.base!.world.scene;
        const world = this.base!.world;

        const testFunc = () => {
            world.AddObject({key:'cube',state:this.base!.state},{"pos": {x: 0, y: 0, z: 0}})

            //Change state
            if (world.GetState() === "/test")  world.ChangeState('/test/hello')
            else world.ChangeState('/test')
        }

        const testFunc2 = () => {
            let cube = this.base?.world.sceneObjects.filter((object)=>(object!.name === "ProjectionTextCube"))[0]
            if (cube) world.DestroyObject(cube)
            else world.AddObject({key:"ProjectionTextCube",state:this.base!.state})
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
        if (b) b.style.transform = translate3d({x:-(m/2),y:-2,z:0},"px")

    }

}