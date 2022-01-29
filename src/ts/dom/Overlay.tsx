import DomText, { DomParams } from '../behaviours/DomText'

import { ReactComponent as Line } from '../../svg/line.svg';

export default class Overlay extends DomText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <Line id={`${params.elementId}_svg_topLine`} width={window.innerWidth} />
                <Line id={`${params.elementId}_svg_bottomLine`} width={window.innerWidth} />
            </>
        );
    }

    Animate(): void {}

}