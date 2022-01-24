import DomText, { DomParams } from '../behaviours/DomText'

const ROUNDTO : number = 3;

export default class CameraDebug extends DomText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <p id = "cameraDebug_pos"></p>
                <p id = "cameraDebug_rot"></p>
            </>
        );
    }

    Animate(): void {
        const camera = this.base!.world.scene.camera;
        const a = document.getElementById("cameraDebug_pos");
        const b = document.getElementById("cameraDebug_rot");
        if (a) a.innerText = `Position: (X: ${camera.position.x.toFixed(ROUNDTO)} Y: ${camera.position.y.toFixed(ROUNDTO)} Z: ${camera.position.z.toFixed(ROUNDTO)})`
        if (b) b.innerText = `Quaternion: (X: ${camera.quaternion.x.toFixed(ROUNDTO)} Y: ${camera.quaternion.y.toFixed(ROUNDTO)} Z: ${camera.quaternion.z.toFixed(ROUNDTO)} W: ${camera.quaternion.w.toFixed(ROUNDTO)})`
    }

}