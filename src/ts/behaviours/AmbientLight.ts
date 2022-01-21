import Behaviour from "./Behaviour";
import * as THREE from 'three';

interface AmbientLightParams{
    color: number,
    intensity: number
}

export class AmbientLight extends Behaviour{

    firstRun : boolean = false;

    Get(){}

    Step(){
        if (!this.firstRun){
            if (this.base && this.base.mesh){
                const params = this.parameters as AmbientLightParams;

                //Create a light as a child to this object
                let light = new THREE.AmbientLight(params.color,params.intensity)
                this.base.mesh.add(light)

                this.firstRun = true;
            }
        }
    }

}

export default AmbientLight