/*
SceneManager.ts
This is the uppermost THREE class. All of our THREE code will run underneath this SceneManager.
This class is responsible for renderer-related processes. NOT actual geometries.
Additionally, this Scene Class will hold all of our Data and Configurations

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

    //World
    world: World;
    
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
        this.world = new World();
    }

    //Start the scene
    Initialize(){
        //Add our World
        this.scene.add(this.world);

        //Locally point to our vars (references to "this" won't work within Step Function)
        //TODO: You can pass this all into the Step function as a Context
        var r = this.renderer;
        var t = this.time;
        var s = this.scene;
        var c = this.camera;
        var w = this.world;
        
        //Function called every frame
        var Step = function(){
            requestAnimationFrame( Step ); 

            //Set the callback functino to be the animation function again
            t = t + 0.01;
            w.Step();

            r.render(s, c);
        }

        //Start Animations
        Step();
    }

}

export default SceneManager