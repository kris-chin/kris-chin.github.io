/*
    MaterialLoader.ts

    Responsible for loading all Materials.

*/

import * as THREE from 'three';

export class MaterialLoader {

    map : Map<string, (THREE.Material | Array<THREE.Material>)>

    constructor(){
        this.map = new Map<string,(THREE.Material | Array<THREE.Material>)>();

        //Start adding pairs to our map
        this.MapBasicMaterials();
        this.MapSkyboxes();
    }

    //Adds Materials to Material Map
    MapBasicMaterials(){
        //Lambert Materials have shadow computations enabled
        this.map.set('red', new THREE.MeshLambertMaterial( { color: 0xff4040}));
        this.map.set('yellow', new THREE.MeshLambertMaterial( { color: 0xffec40}));
        this.map.set('green', new THREE.MeshLambertMaterial( { color: 0x17a64b}));
        this.map.set('blue', new THREE.MeshLambertMaterial( { color: 0x424bf5}));
        this.map.set('white', new THREE.MeshLambertMaterial( {color: 0xffffff}));

    }

    //Creates Skyboxes
    MapSkyboxes(){
        const imageDir = './images/skyboxes/';
        const skyboxNames = ['skybox0'];
        const filetype = '.png';
        const sides = ['ft','bk','up','dn','rt','lf']; //I'm pretty sure the order of these sides determines where the materials get placed in a material array

        //Create an array of objects containing:
        //  Skybox Name
        //  An array of all of the filenames for each side of the skybox
        const skyboxes = skyboxNames.map(skyboxName =>{
            
            //Create Array of all necessary images
            const arr_images = sides.map(side=>{
                return imageDir + skyboxName + '_' + side + filetype;
            });

            //Load all necessary images into textures and turn them into material
            const arr_mats = arr_images.map(filename=>{
                let texture = new THREE.TextureLoader().load(filename,
                    
                    //Function called when texture is loaded
                    function(){
                        console.debug("'" + filename + "': successfully loaded");
                    },

                    //Function called when texture is loading
                    function(xhr){
                        console.debug("'" + filename + "':" + (xhr.loaded/xhr.total * 100) + '% loaded')
                    },

                    //Function called when error occured
                    function(xhr){
                        console.error(("An error occured in loading texture: '" + filename + "'"), xhr);
                    }
                );

                //For now, return soon-to=be-populated Texture
                return new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.BackSide
                });

            });

            //Do note that the textures in arr_mats will still be unpopulated until they are loaded.

            //Return Mats
            return {'name': skyboxName, 'materials' : arr_mats};
        });

        //Add our array of materials to the map
        for (let skybox of skyboxes){
            this.map.set(skybox.name, skybox.materials as THREE.Material[]);
        }

    }
    

}

export default MaterialLoader