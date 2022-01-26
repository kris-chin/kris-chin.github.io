import Behaviour from "../Behaviour";

interface CubeCircleParams{
    rotation : number
}

export class CubeCircle extends Behaviour{

    firstRun : boolean = false;

    Get(){}
    OnDestroy(){}

    //Code for first run
    Init(){
        if (this.base && this.base.mesh){

            let params = this.parameters as CubeCircleParams

            //Creates 30 Cubes
            for (let i = 0; i < 30; i++){

                let cuber = this.base.world.AddObject({key:'cube',state:this.base!.state},{'parent':this.base});
    
                if (cuber && cuber.mesh){
                    cuber.mesh.position.set( Math.cos(i/30 * 2*Math.PI) * 2, Math.sin(i/30 * 2*Math.PI) * 2, 0)
                    cuber.mesh.rotation.z = ((Math.random() - 0.5) * 2) * 2;
                }
                
            }
            this.base.mesh.rotateX(params.rotation)
            this.firstRun = true;
        }
    }

    //Code called every frame
    Step(){
        if (!this.firstRun) this.Init()
    }

}

export default CubeCircle