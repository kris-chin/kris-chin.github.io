import DomText, { DomParams } from '../../../../engine/dom/DomText'

export default class ShowcaseOverlay extends DomText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div id={`${params.elementId}_div_links`}>
                    <div className={`${params.elementId}_div_link`}>
                        <svg height="1em" width="1em">
                            <circle cx = '0.5em' cy = '0.5em' r='0.5em' />
                        </svg>
                        <a>about me</a>
                    </div>
                    <div className={`${params.elementId}_div_link`}>
                        <svg height="1em" width="1em">
                            <rect x = '0em' y = '0em'width='1em'height='1em' />
                        </svg>
                        <a>all projects</a>
                    </div>
                    <div className={`${params.elementId}_div_link`}>
                        <svg id="triangle" viewBox="0 0 100 100">
            	            <polygon points="50 0, 100 100, 0 100"/>
                        </svg>
                        <a>contact</a>
                    </div>
                </div>
                <div id={`${params.elementId}_div_sectionInfo`}>
                    <p id={`${params.elementId}_p_sectionTitle`}>selected works</p>
                    <div id={`${params.elementId}_div_sectionData`}>
                        <div className = {`${params.elementId}_div_property`}>
                            <p>project: </p>
                            <p>krischinlayon.com</p>
                        </div>
                        <div className = {`${params.elementId}_div_property`}>
                            <p>year:</p>
                            <p>2022</p>
                        </div>
                        <div className = {`${params.elementId}_div_property`}>
                            <p>category:</p>
                            <p>frontend</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    Animate(): void {
        
    }

}