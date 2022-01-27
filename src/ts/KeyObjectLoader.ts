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
        mesh: string,
        behaviours : Array<{ name:string,params:Object} >
    }
}

export class KeyObjectLoader {

    map : Map<string,Object>

    constructor(map: Map<string,Object>){
        this.map = map
    }

    //Asynchronous call to load geometries. Promises a Map of the geometries
    LoadKeyObjects() : Promise< Map<string,Object> > {
        var promise = new Promise< Map<string,Object> >( (resolve,reject) => {
            
            //Wait for geometry data and then map it
            fetch('/json/keyObjects.json5')
            .then(response => response.text())
            .then(data => {

                //Parse the JSON5 file
                const KeyObjects : Array<Object> = JSON5.parse(data)

                //Start mapping geometries to map
                this.MapKeyObjects(KeyObjects)

                //Resolve Promise
                resolve(this.map)
            })
            
        })

        return promise
    }

    //Maps keyObjects to map
    MapKeyObjects(keyObjects: Array<Object>){
        for ( let keyObject of keyObjects){
            const k = keyObject as KeyObject
            this.map.set(k.name, keyObject)
        }
    }
    
}

export default KeyObjectLoader