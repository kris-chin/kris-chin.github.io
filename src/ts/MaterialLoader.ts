/*
    MaterialLoader.ts

    Responsible for loading all Materials.

*/

import * as THREE from 'three';
import JSON5 from 'json5';

//Define the Material Interface
interface Material {
    name : string,
    type : string,
    materialParameters : THREE.MaterialParameters
}

//Define the MaterialLoader
export class MaterialLoader {

    map : Map<string, (THREE.Material | Array<THREE.Material>)>

    constructor(map: Map<string, (THREE.Material | Array<THREE.Material>)>){
        this.map = map
    }
    
    //Asynchronous call to load materials. Promises a Map of the materials
    LoadMaterials() : Promise< Map<string, (THREE.Material | Array<THREE.Material>)> >{
        var promise = new Promise< Map<string, (THREE.Material | Array<THREE.Material>)> >( (resolve,reject) => {
            
            //Wait for material data and then map it
            fetch('./json/materials.json5')
            .then(response => response.text())
            .then(data => {

                //Parse the JSON5 File
                const materials : Array<Material> = JSON5.parse(data)

                //Start adding key-value pairs to our map
                this.MapMaterials(materials);

                //Resolve  promise
                resolve(this.map)
            })
        }) 

        return promise
    }

    //Adds Materials to Material Map
    MapMaterials(materials : Array<Material>){
        //Go through the material data and map accordingly
        for (let material of materials){
            //Map the material based on type
            switch (material.type){
                case "lambert":
                    this.map.set(material.name, new THREE.MeshLambertMaterial(material.materialParameters))
                    break;
                case "skybox":
                    this.MapSkyboxes(material.name)
                    break;
                default:
                    console.error("Invalid Material Type: '" + material.type + "'")
                    break;
            } 
        }

    }

    //Creates Skyboxes
    MapSkyboxes(skyboxName: string){
        const imageDir = './images/skyboxes/';
        const filetype = '.png';
        const sides = ['ft','bk','up','dn','rt','lf']; //I'm pretty sure the order of these sides determines where the materials get placed in a material array

        //Create an array of objects containing:
        //  Skybox Name
        //  An array of all of the filenames for each side of the skybox
            
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

        //Add our array of materials to the map
        this.map.set(skyboxName, arr_mats as THREE.Material[]);

    }
    

}

export default MaterialLoader