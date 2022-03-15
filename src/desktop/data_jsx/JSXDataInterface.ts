export default class JSXData {
    name: string;
    JSXElement: JSX.Element;

    constructor(name: string, JSXElement: JSX.Element){
        this.name = name;
        this.JSXElement = JSXElement
    }
}