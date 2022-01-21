/*
    KeyObjectLoader.ts

    Responsible for loading keyObjects

*/
import JSON5 from 'json5';

//Interface for object keys
export interface KeyObject {
    name: string,
    sceneObject: {
        geometry : string,
        material : string,
        behaviours : Array<{ name:string,params:Object} >
    }
}

export class KeyObjectLoader {

    map : Map<string,KeyObject>

    constructor(map: Map<string,KeyObject>){
        this.map = map
    }

    //Asynchronous call to load geometries. Promises a Map of the geometries
    LoadKeyObjects() : Promise< Map<string,KeyObject> > {
        var promise = new Promise< Map<string,KeyObject> >( (resolve,reject) => {
            
            //Wait for geometry data and then map it
            fetch('./json/keyObjects.json5')
            .then(response => response.text())
            .then(data => {

                //Parse the JSON5 file
                const KeyObjects : Array<KeyObject> = JSON5.parse(data)

                //Start mapping geometries to map
                this.MapKeyObjects(KeyObjects)

                //Resolve Promise
                resolve(this.map)
            })
            
        })

        return promise
    }

    //Maps keyObjects to map
    MapKeyObjects(keyObjects: Array<KeyObject>){
        for (let keyObject of keyObjects){
            this.map.set(keyObject.name, keyObject)
        }
    }
    
}

export default KeyObjectLoader