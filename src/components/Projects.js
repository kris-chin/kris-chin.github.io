import React from 'react';

import './Projects.css';
import githubLogo from './images/github.png';

/*
import Link from 'react-router-dom';
*/
import projectData from '../data/projectList.json';


export class Item extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            name : this.props.name,
            description : this.props.description,
            github : this.props.github
        }

    }

    render(){

        return(
            <div class = 'showcaseItem'>
                <div class = 'item-header'>
                    {this.state.name}
                </div>

                <div class ='item-body'>
                    {this.state.description}
                </div>

                <div class = 'item-footer'>
                    <div class = 'item-link'>
                        <img class = "item-link-icon" src={githubLogo} alt=""/>
                        <a href={this.state.github} class ='item-link-name'>
                            GITHUB
                        </a>
                    </div>
                </div>
            </div>
        );
    }

}

export class Projects extends React.Component {

    render(){

        //map the projectData to Item Components
        const projects = projectData.projects.map( (p, index) => {
            return(
                <Item
                    name={p.name}
                    description={p.description}
                    github={p.github}
                />
            )
        })


        return(
            <div class = "things">
                <div id="showcase">
                    <b><p>PROJECTS AND SCRIPTS</p></b>
                    <div> 
                        { projects }
                    </div>
                </div>
            </div>
        );
    }
}

export default Projects;