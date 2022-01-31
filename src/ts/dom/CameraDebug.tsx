import DomText, { DomParams } from '../behaviours/DomText'

const ROUNDTO : number = 3;

export default class CameraDebug extends DomText{

    Render(params: DomParams): JSX.Element {
        const camera = this.base!.world.scene.camera;
        const target = this.base!.world.scene.controls.target;

        const log = () => {
            console.log("%c Camera Position, Quaternion, & OrbitTarget: %o", "color: DarkOrchid", JSON.parse(JSON.stringify({"position": camera.position, "quaternion": camera.quaternion, "orbitTarget": target})) )
        }

        return(
            <>
                <p id = "cameraDebug_pos"></p>
                <p id = "cameraDebug_qua"></p>
                <p id = "cameraDebug_target"></p>
                <button onClick={log}>Log</button>
            </>
        );
    }

    Animate(): void {
        const camera = this.base!.world.scene.camera;
        const target = this.base!.world.scene.controls.target;
        const a = document.getElementById("cameraDebug_pos");
        const b = document.getElementById("cameraDebug_qua");
        const c = document.getElementById("cameraDebug_target");
        if (a) a.innerText = `Position: (X: ${camera.position.x.toFixed(ROUNDTO)} Y: ${camera.position.y.toFixed(ROUNDTO)} Z: ${camera.position.z.toFixed(ROUNDTO)})`
        if (b) b.innerText = `Quaternion: (X: ${camera.quaternion.x.toFixed(ROUNDTO)} Y: ${camera.quaternion.y.toFixed(ROUNDTO)} Z: ${camera.quaternion.z.toFixed(ROUNDTO)} W: ${camera.quaternion.w.toFixed(ROUNDTO)})`
        if (c) c.innerText = `OrbitTarget: (X: ${target.x.toFixed(ROUNDTO)} Y: ${target.y.toFixed(ROUNDTO)} Z: ${target.z.toFixed(ROUNDTO)})`
    }

}