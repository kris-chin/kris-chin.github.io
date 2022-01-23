import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../scss/textLayer.scss'

export default class TextLayer extends Component {

  elements : Array<JSX.Element>
  totalCount : number; //this number never goes down and is used to assign keys

  constructor(props: Object){
    super(props);
    this.totalCount = 0;
    this.elements = new Array<JSX.Element>()
  }

  AddElement(element : JSX.Element, elementId : string){
    this.totalCount += 1;
    const tempElement : JSX.Element = (<div id = {elementId} key = {this.totalCount}>{element}</div>);
    this.elements.push(tempElement) //push element to array

    //Then re-render the element inside the textLayer div
    ReactDOM.render(this.elements, document.getElementById('textLayer'))
  }

  ReRender(){ //helper call to re-render component
    ReactDOM.render(this.elements, document.getElementById('textLayer'))
  }

  render() {
    return (<div id = 'textLayer'></div>);
  }
}
