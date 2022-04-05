import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class TextLayer extends Component {

  elements : Array<JSX.Element>
  totalCount : number; //this number never goes down and is used to assign keys

  constructor(props: Object){
    super(props);
    this.totalCount = 0;
    this.elements = new Array<JSX.Element>()
  }

  //Returns true if the element is successfully acquired
  AddElement(element : JSX.Element, elementId : string) {
    this.totalCount += 1;
    const tempElement : JSX.Element = (<div id = {elementId} key = {this.totalCount}>{element}</div>);
    this.elements.push(tempElement) //push element to array

    //Then re-render the element inside the textLayer div
    ReactDOM.render(<>{this.elements}</>, document.getElementById('textLayer'))
  }

  RemoveElement(elementId: string){
    //Create new elements array that doesn't contain the element
    const e = this.elements.filter((element)=>{return (element.props.id !== elementId)})
    this.elements = e
    //Re-render with removed-element
    ReactDOM.render(<>{this.elements}</>, document.getElementById('textLayer'))
  }

  ReRender(){ //helper call to re-render component
    ReactDOM.render(<>{this.elements}</>, document.getElementById('textLayer'))
  }

  //This text will dissapear once the textLayer properly starts running
  //This function is called every time there is new loading progress
  UpdateProgress(progress: number){
    const progressInfo = document.getElementById("textLayer_progressInfo");
    if (progressInfo) progressInfo.innerText = `${ (progress * 100).toFixed(0) }%`;
  }

  render() {
    return (
      <>
        <div id = 'textLayer'>
          <div id = 'textLayer_upperProgressInfo'>
            <p id = "textLayer_progressInfo"></p> 
          </div>
        </div>
      </>
      );
  }
}
