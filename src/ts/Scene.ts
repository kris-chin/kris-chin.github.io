/*
    SceneManager.ts

    This is the uppermost THREE class. All of our THREE code will run underneath this SceneManager.
    This class is responsible for renderer-related processes. NOT actual Meshes, Geometries, or Materials.

    All "Global" variables or configurations are in the World Class, a seperate class that handles actual objects.

    Every Scene Class creates its own World class.
*/

//Imports from JS packages
import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from '../js/OrbitControls';
import anime from 'animejs';

//THREE imports
import World from './World';

//Non-Class variables used simply for the Window Resize Function that is called on Window Resize.
var cam : THREE.PerspectiveCamera;
var ren : THREE.Renderer;

//Interface for the Camera Angle logged in CameraDebug.tsx
interface CameraAngle{
    position : { //Position value of the Camera
        x : number,
        y : number,
        z : number
    },
    quaternion : { //Quaternion value of the Camera
        _x : number,
        _y : number,
        _z : number,
        _w : number
    },
    orbitTarget : {  //Target value of the OrbitControls
        x : number,
        y : number,
        z : number
    }
}

export class Scene {

    //Scene Related
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    controls: OrbitControls;

    //World for this Scene
    world: World;

    //Pointer to the component that the scene rests in
    canvas : React.Component
    
    constructor(hostComponent: React.Component){
        this.canvas = hostComponent; //point to the host component
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, //FOV
            window.innerWidth/window.innerHeight, //Resolution
            0.01, //Near Clipping Plane
            30000 //Far Clipping Plane
        );
        this.camera.position.set(0, 0, 0); //move the camera a bit out

        //add the helper camera to debug the light
        //this.scene.add(new THREE.CameraHelper(this.camera));

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true; //enables shadows
        //this.renderer.shadowMap.type = 

        //Setup Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        this.controls.enableDamping = true;
        this.controls.minDistance = 5;
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
        
        //Function called every frame
        const Step = () => {
            //Set the callback function to be the animation function again
            requestAnimationFrame( Step ); //This line is specifically a CPU-Friendly way to use the callback function 

            //Call the step function in the world.
            //Make all calculations to World instead of here
            this.world.Step();

            //Update Controls
            this.controls.update();

            //Render
            this.renderer.render(this.scene, this.camera);
        }

        //Start Animations
        Step();
    }

    //Helper Function to Move the Camera to a given angle
    //All you have to do is easily paste the desired camera angle as a parameter provided by CameraDebug.log()
    MoveCamera(angle : CameraAngle){
        var timeline = anime.timeline({});
        //Then Animate the quaternion
        timeline.add(
            {
                targets: this.camera.quaternion,
                _x : angle.quaternion._x,
                _y : angle.quaternion._y,
                _z : angle.quaternion._z,
                _w : angle.quaternion._w
            }, 0
        )
        //First do the Postion And Orbit Target
        timeline.add(
            {
                targets: this.camera.position,
                x : angle.position.x,
                y : angle.position.y,
                z : angle.position.z
            }, 0
        )
        timeline.add(
            {
                targets: this.controls.target,
                x : angle.orbitTarget.x,
                y : angle.orbitTarget.y,
                z : angle.orbitTarget.z
            }, 0
        )
    }

}

export default Scene