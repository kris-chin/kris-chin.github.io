import React from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import './Splash.scss';

export class Splash extends React.Component {

    three(){
      var scene = new THREE.Scene();
              //camera:
                  //fov: 75
                  //resolution: innerwidth/innerheigh
                  //near clipping plane: 0.1
                  //far clipping plane: 1000
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight); //set the renderer size to width x height
      
      
      //we're targeting our placeholder div and replacing it with a canvas element
      const element = document.getElementById('three');
      element.parentNode.replaceChild(renderer.domElement, element);


      var geometry = new THREE.BoxGeometry( 1, 1, 1 ); //set a geometry that is a 1x1x1 box
      var material = new THREE.MeshBasicMaterial( { color: 0xffffff } ); //create a white mesh material
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube ); //add the cube to the scene
  
      camera.position.z = 5; //move the camera a bit out
  
            var time = 0;
  
      var animate = function () { //main animate function
        requestAnimationFrame( animate );
  
                time += 0.01;
  
        cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                
                cube.position.y = 0.25 * Math.sin(time*2);
  
        renderer.render( scene, camera );
      };
  
      animate();
    }  
  
    componentDidMount(){
      this.three();
    }
  
  
    render(){
      return (
        <div>
          <div id='three' />
          <div id ="splash-title">
            KRISCHIN LAYON
          </div>
          <div id="enter">
          <Link to="/things" class = "enterLink">
                ENTER
          </Link>
          </div>
        </div>
      )
    }
  }

export default Splash;