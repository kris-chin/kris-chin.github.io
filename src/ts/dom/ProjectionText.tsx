import DomText, { DomParams, rotate3d, translate3d } from '../behaviours/DomText'
import * as THREE from 'three';

//What percent from the viewport border to cut off text (to avoid view-resizing)
const BORDER = 0.1

export default class ProjectionText extends DomText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <p id ="raycastText_hello">Hi There </p>
            </>
        );
    }

    Animate(): void {
        const pos = this.base!.mesh.position

        //Create a new Vector at the object position and project it using the camera
        const p = new THREE.Vector3(pos.x, pos.y, pos.z);
        var v = p.project(this.base!.world.scene.camera);

        //Relate the Vector to the viewport
        v.x = (v.x + 1) / 2 * window.innerWidth; 
        v.y = -(v.y - 1) / 2 * window.innerHeight;
             
        const a = document.getElementById("raycastText_hello")
        if (a) {
            if ( (v.x > window.innerWidth - (window.innerWidth * BORDER)) || (v.y > window.innerHeight - (window.innerHeight * BORDER)) ) a.style.display = "none";
            else if ( (v.x < window.innerWidth * BORDER) || (v.y < window.innerHeight * BORDER) ) a.style.display = "none";
            else { 
                if (a.style.display !== "absolute") a.style.display = "initial"
                a.style.transform = translate3d({x:v.x,y:v.y,z:0},"px");
            }
        }
    }

}