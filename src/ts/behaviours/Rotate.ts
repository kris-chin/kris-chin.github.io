import Behaviour from "../Behaviour";

interface RotateParameters {
    speed : number
}

export class Rotate extends Behaviour{

    //selfTime : number = 0;

    OnDestroy(){}

    Get(){}

    Step(){
        if (this.base && this.base.mesh){
            let params = this.parameters as RotateParameters;

            this.base.mesh.rotateY(params.speed);
            //this.selfTime += 0.01
        }
    }

}

export default Rotate