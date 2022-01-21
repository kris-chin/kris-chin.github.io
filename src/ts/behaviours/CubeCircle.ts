import Behaviour from "./Behaviour";

interface CubeCircleParams{
    rotation : number
}

export class CubeCircle extends Behaviour{

    firstRun : boolean = false;

    Get(){}

    Step(){
        if (!this.firstRun){
            if (this.base && this.base.mesh){

                let params = this.parameters as CubeCircleParams

                //Creates 30 Cubes
                for (let i = 0; i < 30; i++){

                    let cuber = this.base.world.AddObject('cube',this.base.mesh);
        
                    if (cuber && cuber.mesh){
                        cuber.mesh.position.set( Math.cos(i/30 * 2*Math.PI) * 2, Math.sin(i/30 * 2*Math.PI) * 2, 0)
                        cuber.mesh.rotation.z = ((Math.random() - 0.5) * 2) * 2;
                    }
                    
                }

                this.firstRun = true;

                this.base.mesh.rotateX(params.rotation)
            }
        }
    }

}

export default CubeCircle