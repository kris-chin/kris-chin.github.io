/*
SceneManager.ts
This is the uppermost THREE class. All of our THREE code will run underneath this SceneManager.
This class is responsible for renderer-related processes. NOT actual geometries.

For readibility purposes, all of our actual geometry will be nested within a seperate World class.

*/

//Imports from JS packages
import * as THREE from 'three';

//THREE imports
import World from './World';


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
        this.camera.position.z = 5; //move the camera a bit out

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.time = 0;
    }

    //Start the scene
    Initialize(){
        //Add our World
        this.scene.add(new World());

        //Start Animations
        this.Step()
    }

    //Function called every frame
    Step(){

        //Set the callback functino to be the animation function again
        requestAnimationFrame( this.Step ); 
        this.time += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

}

export default SceneManager