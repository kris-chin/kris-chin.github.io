import Behaviour from "../Behaviour";

interface RotateParameters {
    speed : number
}

export class Rotate extends Behaviour{

    Get(){}

    Step(){
        if (this.base && this.base.mesh){

            let params = this.parameters as RotateParameters;

            this.base.mesh.rotation.x += 0.01 * params.speed;
            this.base.mesh.rotation.y += 0.01 * params.speed;
            this.base.mesh.position.y += 0.01 * Math.sin((this.base.world).time)
        }
    }

}

export default Rotate