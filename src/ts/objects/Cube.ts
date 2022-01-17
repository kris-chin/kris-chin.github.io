import SceneObject from './SceneObject'

export class Cube extends SceneObject {

    //called every frame
    Step(){
        if (this.mesh){
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.01;
            this.mesh.position.y += 0.01 * Math.sin((this.world).time)
        }

    }

}

export default Cube