import Behaviour from "./Behaviour";

export class Rotate extends Behaviour{

    Get(){}

    Step(){
        if (this.base.mesh){
            this.base.mesh.rotation.x += 0.01;
            this.base.mesh.rotation.y += 0.01;
            this.base.mesh.position.y += 0.01 * Math.sin((this.base.world).time)
        }
    }

}

export default Rotate