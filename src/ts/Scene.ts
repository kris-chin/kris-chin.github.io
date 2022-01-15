/*
SceneManager.ts
This is the uppermost THREE class. All of our THREE code will run underneath this SceneManager.
This class is responsible for renderer-related processes. NOT actual geometries.
Additionally, this Scene Class will hold all of our Data and Configurations

For readibility purposes, all of our actual geometry will be nested within a nested World class.



*/

//Imports from JS packages
import * as THREE from 'three';

//THREE imports
import World from './World';


export class Scene {

    //Scene Related
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.Renderer;

    //World for this Scene
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
        
        this.world = new World(this);
    }

    //Start the scene
    Initialize(){
        //Add our World inside Scene
        this.scene.add(this.world);

        //Locally point to our vars (references to "this" won't work within Step Function)
        //TODO: You can pass this all into the Step function as a Context
        var r = this.renderer;
        var s = this.scene;
        var c = this.camera;
        var w = this.world;
        
        //Function called every frame
        var Step = function(){
            //Set the callback functino to be the animation function again
            requestAnimationFrame( Step ); 

            //Call the step function in the world.
            //Make all calculations to World instead of here
            w.Step();

            //Render
            r.render(s, c);
        }

        //Start Animations
        Step();
    }

}

export default Scene