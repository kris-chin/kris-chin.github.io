import DomText, { DomParams, translate3d } from './DomText'
import * as THREE from 'three';

//What percent from the viewport border to cut off text (to avoid view-resizing)
const BORDER = 0 //We have css: 'overflow: hidden'. but i'm keeping this here just in case
//Offsets for placement
const X_OFFSET = -10;
const Y_OFFSET = -50;

export default class ProjectionText extends DomText{

    screenX : number = 0;
    screenY : number = 0;

    Render(params: DomParams): JSX.Element {
        return(
            <>
            </>
        );
    }

    Animate(moveDiv : boolean = true): void {
        const params = this.parameters as DomParams
        const pos = this.base!.mesh!.position

        //Create a new Vector at the object position and project it using the camera
        const p = new THREE.Vector3(pos.x, pos.y, pos.z);
        var v = p.project(this.base!.world.scene.camera);

        //Relate the Vector to the viewport
        v.x = (v.x + 1) / 2 * window.innerWidth + X_OFFSET; 
        v.y = -(v.y - 1) / 2 * window.innerHeight + Y_OFFSET;

        //Update Screen X and Y for reference by other objects
        this.screenX = v.x;
        this.screenY = v.y

        if (moveDiv){
             
            const a = document.getElementById(params.elementId)
            if (a) {
                if ( (v.x > window.innerWidth - (window.innerWidth * BORDER)) || (v.y > window.innerHeight - (window.innerHeight * BORDER)) ) a.style.display = "none";
                else if ( (v.x < window.innerWidth * BORDER) || (v.y < window.innerHeight * BORDER) ) a.style.display = "none";
                else { 
                    if (a.style.display !== "inherit") a.style.display = "inherit"
                    a.style.transform = translate3d({x:v.x,y:v.y,z:0},"px");
                }
            }

        }
    }

}