import DomText, { DomParams } from '../../../../engine/dom/DomText'
import anime from 'animejs';

export interface ProjectData {
    name: string,
    year: string,
    categories: string[]
}

//Live resizing of property divs since there is not CSS setting that LIVE updates to inner content size
const resizeDivs = () => {
    var propertyDivs = Array.from(document.querySelectorAll('div.propertyValue'))
    for (let div_element of propertyDivs){
        const div = div_element as HTMLElement
        //note: the upper div wrapper for the p value is important because it allows the first child to be width 100%
        const firstChild : HTMLElement = Array.from(div.children)[0] as HTMLElement
        const secondChild : HTMLElement = Array.from(firstChild.children)[0] as HTMLElement
        div.style.width = window.getComputedStyle(secondChild).width
    }
}

export default class ShowcaseOverlay extends DomText{

    private animationSpeed : number = 500; //speed of overlay update animation

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div id={`${params.elementId}_div_links`}>
                    <div className={`${params.elementId}_div_link`}>
                        <svg id={`${params.elementId}_svg_a`} height="1em" width="1em">
                            <circle cx = '0.5em' cy = '0.5em' r='0.5em' />
                        </svg>
                        <a id={`${params.elementId}_a_a`}>about me</a>
                    </div>
                    <div className={`${params.elementId}_div_link`}>
                        <svg id={`${params.elementId}_svg_b`} height="1em" width="1em">
                            <rect x = '0em' y = '0em'width='1em'height='1em' />
                        </svg>
                        <a id={`${params.elementId}_a_b`}>all projects</a>
                    </div>
                    <div className={`${params.elementId}_div_link`}>
                        <svg id={`${params.elementId}_svg_c`} viewBox="0 0 100 100">
            	            <polygon points="50 0, 100 100, 0 100"/>
                        </svg>
                        <a id={`${params.elementId}_a_c`}>contact</a>
                    </div>
                </div>
                <div id={`${params.elementId}_div_sectionInfo`}>
                    <div id={`${params.elementId}_div_sectionTitleWrapper`}>
                        <p id={`${params.elementId}_p_sectionTitle`}>selected works</p>
                    </div>
                    <div id={`${params.elementId}_div_sectionData`}>
                        <div className = {`${params.elementId}_div_property`}>
                            <p className={'label'}>project: </p>
                            <div className={'propertyValue'}>
                                <div><p id ={`${params.elementId}_p_data_projectName`} className = {`overwrite`}>krischinlayon.com</p></div>
                            </div>
                        </div>
                        <div className = {`${params.elementId}_div_property`}>
                            <p className={'label'}>year:</p>
                            <div className={'propertyValue'}>
                                <div><p id = {`${params.elementId}_p_data_projectYear`}className= {`overwrite`}>2022</p></div>
                            </div>
                        </div>
                        <div className = {`${params.elementId}_div_property`}>
                            <p className={'label'}>category:</p>
                            <div className={'propertyValue'}>
                                <div><p id = {`${params.elementId}_p_data_projectTags`}className = {`overwrite`}>frontend</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    Animate(): void {}

    //When called, updates the section title with an animation
    UpdateSectionTitle(){

    }

    //When called, updates the project name, year, and tags
    UpdateSectionData(projectData: ProjectData){
        console.log('called')
        const params = this.parameters as DomParams
        const p_data_projectName = document.getElementById(`${params.elementId}_p_data_projectName`)
        const p_data_projectYear = document.getElementById(`${params.elementId}_p_data_projectYear`)
        const p_data_projectTags = document.getElementById(`${params.elementId}_p_data_projectTags`)

        var timeline = anime.timeline()
        var timeline2 = anime.timeline()

        timeline //move text to the very right
        .add({
          targets:`.overwrite`,
          width: '0%',
          easing: 'easeInOutQuart',
          duration: this.animationSpeed,
          update: resizeDivs,
          complete: ()=>{
            if (p_data_projectName) p_data_projectName.innerHTML = projectData.name;
            if (p_data_projectYear) p_data_projectYear.innerHTML = projectData.year;
            if (p_data_projectTags) p_data_projectTags.innerHTML = projectData.categories.join(', ');

            timeline2
            .add({
                targets:`.overwrite`,
                width: ['0%', '100%'],
                easing: 'easeInOutQuart',
                duration: this.animationSpeed,
                update: resizeDivs,
            }, 0)

          }
        }, 0)
    }

    Clear(){
        anime({
            targets: '.overwrite',
            width: '0%',
            easing: 'easeInOutQuart',
            duration: this.animationSpeed,
            update: resizeDivs
        })
    }

}