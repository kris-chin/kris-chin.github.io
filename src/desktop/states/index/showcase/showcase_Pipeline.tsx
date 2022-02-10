import { DomParams } from '../../../../engine/dom/DomText'
import ProjectionText  from '../../../../engine/dom/ProjectionText'

export default class showcase_Pipeline extends ProjectionText{

    Render(params: DomParams): JSX.Element {
        return(
            <>
                <div className = "showcaseText">
                    <h3>Artist-Analytics Pipeline</h3>

                    <p>
                        As someone who releases music, one thing that has bothered me was the lack of homogeneity and insight provided by
                        analytics provided to you by Distributors and Platforms such as Distrokid and Spotify respectively.
                        This is a modular data pipeline that allows for the concatination of multiple artist-analytics datasets.

                        The pipeline was built entirely with Python Pandas.
                        Transformation and calculation tools are to be built in R.
                    </p>
                </div>
            </>
        );
    }

    Animate(): void {
        super.Animate();
    }

}