import DomText, { DomParams, translate3d } from '../behaviours/DomText'
import * as THREE from 'three';

//What percent from the viewport border to cut off text (to avoid view-resizing)
const BORDER = 0 //We have css: 'overflow: hidden'. but i'm keeping this here just in case
//Offsets for placement
const X_OFFSET = -10;
const Y_OFFSET = -50;

export default class ProjectionText extends DomText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <p>This is a whole div</p>
                <p>Crazy right?</p>
                <button>I'm a button</button>
            </>
        );
    }

    Animate(): void {
        const params = this.parameters as DomParams
        const pos = this.base!.mesh.position

        //Create a new Vector at the object position and project it using the camera
        const p = new THREE.Vector3(pos.x, pos.y, pos.z);
        var v = p.project(this.base!.world.scene.camera);

        //Relate the Vector to the viewport
        v.x = (v.x + 1) / 2 * window.innerWidth + X_OFFSET; 
        v.y = -(v.y - 1) / 2 * window.innerHeight + Y_OFFSET;
             
        const a = document.getElementById(params.elementId)
        if (a) {
            if ( (v.x > window.innerWidth - (window.innerWidth * BORDER)) || (v.y > window.innerHeight - (window.innerHeight * BORDER)) ) a.style.display = "none";
            else if ( (v.x < window.innerWidth * BORDER) || (v.y < window.innerHeight * BORDER) ) a.style.display = "none";
            else { 
                if (a.style.display !== "initial") a.style.display = "initial"
                a.style.transform = translate3d({x:v.x,y:v.y,z:0},"px");
            }
        }
    }

}