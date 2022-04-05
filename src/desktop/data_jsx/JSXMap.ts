//Imports all TSX files and creates a map out of the objects
import JSXData from './JSXDataInterface'

import * as showcase from './showcase'

export default function JSXMap(){
    var combined_data : Array<JSXData> = [];

    //TODO: Find a better way to concat all of this external data without writing all of these lines of code
    combined_data = combined_data.concat(showcase.data);

    var map : Map<string, JSX.Element> = new Map<string,JSX.Element>();
    for (let item of combined_data){
        map.set(item.name,item.JSXElement);
    }

    return map;
};