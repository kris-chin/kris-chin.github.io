import Behaviour from "./Behaviour";

export class CubeCircle extends Behaviour{

    firstRun : boolean = false;

    Get(){}

    Step(){
        if (!this.firstRun){
            if (this.base && this.base.mesh){

                //Creates 30 Cubes
                for (let i = 0; i < 30; i++){

                    let cuber = this.base.world.AddObject(this.base.mesh, 'box' , "behaviour:RandomColor", ['Rotate']);
        
                    if (cuber && cuber.mesh){
                        cuber.mesh.position.set( Math.cos(i/30 * 2*Math.PI) * 2, Math.sin(i/30 * 2*Math.PI) * 2, 0)
                        cuber.mesh.rotation.z = ((Math.random() - 0.5) * 2) * 2;
                    }
                    
                }

                this.firstRun = true;
            }
        }
    }

}

export default CubeCircle