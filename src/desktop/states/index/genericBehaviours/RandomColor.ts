import Behaviour from "../../../../engine/Behaviour"

export class RandomColor extends Behaviour{

    Get(){
        let color = Math.random()
        if (color < 0.25){
            return 'red'
        } else if (color < 0.5) {
            return 'blue'
        } else if (color < 0.75) {
            return 'yellow'
        } else{
            return 'green'
        }
    }

    Step(){}
    OnDestroy(){}

}

export default RandomColor