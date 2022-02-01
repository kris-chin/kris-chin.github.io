import DomText, { DomParams, translate3d } from './DomText'
import SceneObject from '../SceneObject';

const ROUNDTO = 3;

export default class name extends DomText{

    debugObjects : Array<SceneObject>;
    currentIndex : number = 0; //current selected index in debugObjects
    co !: SceneObject; //pointer to currently selected object
    INCREMENT : number = 1; //amount to increment by

    constructor(base : (SceneObject|undefined)=undefined, parameters:(Object|undefined)=undefined){
        super(base, parameters);
        this.debugObjects = new Array<SceneObject>();

        //Define our keyboard events

        //Position
        const incrementX_pos = () => this.co.mesh!.translateX(this.INCREMENT);
        const decrementX_pos = () => this.co.mesh!.translateX(-this.INCREMENT);
        const incrementY_pos = () => this.co.mesh!.translateY(this.INCREMENT);
        const decrementY_pos = () => this.co.mesh!.translateY(-this.INCREMENT);
        const incrementZ_pos = () => this.co.mesh!.translateZ(this.INCREMENT);
        const decrementZ_pos = () => this.co.mesh!.translateZ(-this.INCREMENT);

        //Rotation
        const incrementX_rot = () => this.co.mesh!.rotateX(this.INCREMENT);
        const decrementX_rot = () => this.co.mesh!.rotateX(-this.INCREMENT);
        const incrementY_rot = () => this.co.mesh!.rotateY(this.INCREMENT);
        const decrementY_rot = () => this.co.mesh!.rotateY(-this.INCREMENT);
        const incrementZ_rot = () => this.co.mesh!.rotateZ(this.INCREMENT);
        const decrementZ_rot = () => this.co.mesh!.rotateZ(-this.INCREMENT);

        //Scale
        const incrementX_sca = () => this.co.mesh!.scale.set(this.co.mesh!.scale.x + this.INCREMENT, this.co.mesh!.scale.y, this.co.mesh!.scale.z);
        const decrementX_sca = () => this.co.mesh!.scale.set(this.co.mesh!.scale.x - this.INCREMENT, this.co.mesh!.scale.y, this.co.mesh!.scale.z);
        const incrementY_sca = () => this.co.mesh!.scale.set(this.co.mesh!.scale.x, this.co.mesh!.scale.y + this.INCREMENT, this.co.mesh!.scale.z);
        const decrementY_sca = () => this.co.mesh!.scale.set(this.co.mesh!.scale.x, this.co.mesh!.scale.y - this.INCREMENT, this.co.mesh!.scale.z);
        const incrementZ_sca = () => this.co.mesh!.scale.set(this.co.mesh!.scale.x, this.co.mesh!.scale.y, this.co.mesh!.scale.z + this.INCREMENT);
        const decrementZ_sca = () => this.co.mesh!.scale.set(this.co.mesh!.scale.x, this.co.mesh!.scale.y, this.co.mesh!.scale.z - this.INCREMENT);

        //Change Selected object
        const nextObject = () => {
            if (this.currentIndex < this.debugObjects.length) this.currentIndex++;

        }

        const previousObject = () => {
            if (this.currentIndex > 0) this.currentIndex--;
        }

        const increaseIncrement = () => {
            this.INCREMENT *= 10;
        }

        const decreaseIncrement = () => {
            this.INCREMENT /= 10;
        }

        //Assign Event Listener for keypress
        window.addEventListener('keydown',(event)=>{
            if (event.defaultPrevented){
                return; //do nothing if the event was already processed
            }

            //Check which key.
            //Note that this only properly works for QWERTY keyboards. Different keyboards will map to different codes
            //I dont think I need to worry about this.
            switch (event.code){
                case "KeyQ": incrementX_pos(); break;
                case "KeyW": incrementY_pos(); break;
                case "KeyE": incrementZ_pos(); break;
                case "KeyR": incrementX_rot(); break;
                case "KeyT": incrementY_rot(); break;
                case "KeyY": incrementZ_rot(); break;
                case "KeyU": incrementX_sca(); break;
                case "KeyI": incrementY_sca(); break;
                case "KeyO": incrementZ_sca(); break;
                case "KeyA": decrementX_pos(); break;
                case "KeyS": decrementY_pos(); break;
                case "KeyD": decrementZ_pos(); break;
                case "KeyF": decrementX_rot(); break;
                case "KeyG": decrementY_rot(); break;
                case "KeyH": decrementZ_rot(); break;
                case "KeyJ": decrementX_sca(); break;
                case "KeyK": decrementY_sca(); break;
                case "KeyL": decrementZ_sca(); break;
                case "BracketLeft" : previousObject(); break;
                case "BracketRight" : nextObject(); break;
                case "Semicolon" : decreaseIncrement(); break;
                case "Quote" : increaseIncrement(); break;
                default: break;
            }

            event.preventDefault(); //cancel the default action to avoid it being handled twice
        }, true)
    }

    AddDebugObject(object : SceneObject){
        this.debugObjects.push(object);
    }

    Render(params: DomParams): JSX.Element {

        const log = () =>{
            console.log(JSON.parse(JSON.stringify({
                debug: true, //keep debug on just in case
                uniqueId : this.co.uniqueId,
                pos: {
                    x: this.co.mesh!.position.x,
                    y: this.co.mesh!.position.y,
                    z: this.co.mesh!.position.z
                },
                rot: {
                    x: this.co.mesh!.rotation.x,
                    y: this.co.mesh!.rotation.y,
                    z: this.co.mesh!.rotation.z
                },
                sca: {
                    x: this.co.mesh!.scale.x,
                    y: this.co.mesh!.scale.y,
                    z: this.co.mesh!.scale.z
                }
            })))
        }

        return(
            <>
                <p id={`${params.elementId}_name`}>Selected Object: None</p>
                <p id={`${params.elementId}_increment`}>Increment: NA</p>
                <p id={`${params.elementId}_pos`}>Position: (X: NA, Y: NA, Z: NA)</p>
                <p id={`${params.elementId}_rot`}>Rotation: (X: NA, Y: NA, Z: NA)</p>
                <p id={`${params.elementId}_scale`}>Scale: (X: NA, Y: NA, Z: NA)</p>
                <button onClick = {log}>log</button>
            </>
        );
    }

    Animate(): void {
        const params = this.parameters as DomParams
        const co = this.debugObjects[this.currentIndex] //shorthand const for current object

        //update current object pointer
        if (this.co !== co) this.co = co;

        //Get DOM Values
        const div = document.getElementById(params.elementId)
        const name = document.getElementById(`${params.elementId}_name`)
        const increment = document.getElementById(`${params.elementId}_increment`)
        const pos = document.getElementById(`${params.elementId}_pos`)
        const rot = document.getElementById(`${params.elementId}_rot`)
        const scale = document.getElementById(`${params.elementId}_scale`)

        if (div) div.style.transform = translate3d({x:0,y:100,z:0},'px')

        if (this.debugObjects.length !== 0){
            if (name) name.innerText = `Selected Object: '${co.name}' ID: ${co.id}`
            if (increment) increment.innerText = `Increment: ${this.INCREMENT}`
            if (pos) pos.innerText = `Position: (QWE) (X: ${co.mesh!.position.x.toFixed(ROUNDTO)}, Y: ${co.mesh!.position.y.toFixed(ROUNDTO)}, Z: ${co.mesh!.position.z.toFixed(ROUNDTO)})`
            if (rot) rot.innerText = `Rotation: (RTY) (X: ${co.mesh!.rotation.x.toFixed(ROUNDTO)}, Y: ${co.mesh!.rotation.y.toFixed(ROUNDTO)}, Z: ${co.mesh!.rotation.z.toFixed(ROUNDTO)})`
            if (scale) scale.innerText = `Scale: (UIO) (X: ${co.mesh!.scale.x.toFixed(ROUNDTO)}, Y: ${co.mesh!.scale.y.toFixed(ROUNDTO)}, Z: ${co.mesh!.scale.z.toFixed(ROUNDTO)})`
        }
    }

}