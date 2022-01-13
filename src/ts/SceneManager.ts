import * as THREE from 'three';

//Uppermost THREE Class
export class SceneManager {

    //Scene Related
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.Renderer;

    //Animation Related
    time: number;
    
    constructor(){
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, //FOV
            window.innerWidth/window.innerHeight, //Resolution
            0.1, //Near Clipping Plane
            1000 //Far Clipping Plane
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.time = 0;
    }

    //Start the scene
    Initialize(){
        this.Animate()
    }

    //Function called every frame
    Animate(){

        //Set the callback functino to be the animation function again
        requestAnimationFrame( this.Animate ); 
        this.time += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

}

export default SceneManager