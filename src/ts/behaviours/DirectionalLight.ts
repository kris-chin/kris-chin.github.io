import Behaviour from "../Behaviour";
import * as THREE from 'three';

interface DirectionalLightParams{
    color: number,
    intensity: number
}

export class DirectionalLight extends Behaviour{

    firstRun : boolean = false;

    Get(){}
    OnDestroy(){}

    Step(){
        if (!this.firstRun){
            if (this.base && this.base.mesh){
                const params = this.parameters as DirectionalLightParams;

                //Create a light as a child to this object
                let light = new THREE.DirectionalLight(params.color,params.intensity)
                light.castShadow = true; //enable shadows to be cast
                this.base.mesh.add(light)

                this.firstRun = true;
            }
        }
    }

}

export default DirectionalLight