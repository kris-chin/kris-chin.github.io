import DomText, { DomParams } from '../../../../engine/dom/DomText'

export default class ShowcaseOverlay extends DomText{

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
                            <p>project: </p>
                            <div>
                                <p id ={`${params.elementId}_p_data_projectName`} className = {`${params.elementId}_p_overWrite`}>krischinlayon.com</p>
                            </div>
                        </div>
                        <div className = {`${params.elementId}_div_property`}>
                            <p>year:</p>
                            <div>
                                <p id = {`${params.elementId}_p_data_projectYear`}className= {`${params.elementId}_p_overWrite`}>2022</p>
                            </div>
                        </div>
                        <div className = {`${params.elementId}_div_property`}>
                            <p>category:</p>
                            <div>
                                <p id = {`${params.elementId}_p_data_projectTags`}className = {`${params.elementId}_p_overWrite`}>frontend</p>
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
    UpdateSectionData(){
        
    }

}