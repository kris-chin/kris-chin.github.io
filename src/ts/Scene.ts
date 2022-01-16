/*
    SceneManager.ts

    This is the uppermost THREE class. All of our THREE code will run underneath this SceneManager.
    This class is responsible for renderer-related processes. NOT actual Meshes, Geometries, or Materials.

    All "Global" variables or configurations are in the World Class, a seperate class that handles actual objects.

    Every Scene Class creates its own World class.
*/

//Imports from JS packages
import * as THREE from 'three';
import { OrbitControls } from '../js/OrbitControls';

//THREE imports
import World from './World';

//Non-Class variables used simply for the Window Resize Function that is called on Window Resize.
var cam : THREE.PerspectiveCamera;
var ren : THREE.Renderer;

export class Scene {

    //Scene Related
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;

    controls: OrbitControls;

    //World for this Scene
    world: World;
    
    constructor(){
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, //FOV
            window.innerWidth/window.innerHeight, //Resolution
            0.01, //Near Clipping Plane
            30000 //Far Clipping Plane
        );
        this.camera.position.set(0, 0, 0); //move the camera a bit out

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //Setup Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.controls.enableDamping = true;
        this.controls.minDistance = 10;
        this.camera.position.set(0,0,10); //readjust camera

        //Add event listeners
        window.addEventListener('resize', this.OnWindowResize, false); //Adjust to window resize
        this.controls.listenToKeyEvents(window); //Window listens to keypress events
        
        //Set outside variables that can be accessed later outside of context
        cam = this.camera;
        ren = this.renderer;

        //Create World
        this.world = new World(this);
    }

    //Function to call on resize
    private OnWindowResize(){
        cam.aspect = window.innerWidth/window.innerHeight;
        cam.updateProjectionMatrix(); //need to call this whenever updating config
        ren.setSize(window.innerWidth, window.innerHeight);
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
        var con = this.controls
        
        //Function called every frame
        var Step = function(){
            //Set the callback functino to be the animation function again
            requestAnimationFrame( Step ); 

            //Call the step function in the world.
            //Make all calculations to World instead of here
            w.Step();

            //Update Controls
            con.update();

            //Render
            r.render(s, c);
        }

        //Start Animations
        Step();
    }

}

export default Scene