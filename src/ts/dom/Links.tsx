import DomText, { DomParams, translate3d, rotate3d} from "../behaviours/DomText";
import anime from 'animejs';
import * as THREE from 'three';

export default class Links extends DomText{

    Render(params: DomParams): JSX.Element {

        const testFunc = () => this.base!.world.AddObject('cube',{"pos": {x: 0, y: 0, z: 0}})

        const testFunc2 = () => {

            const camera = this.base!.world.scene.camera;
            let cameraPos : THREE.Vector3 = camera.position;

            anime({
                targets: cameraPos,
                x: 10,
                
            });
        }

        return(
            <div id ="links_body">
                <p onClick={testFunc} id = "links_button1">
                    hi
                </p>
                <p onClick={testFunc2} id = "links_button2">
                    son
                </p>
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