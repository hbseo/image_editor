import Action from './Action';
import {convertRGB} from '../helper/ConverRGB'

class Fill extends Action {
  constructor(App) {
    super('Fill', App);
  }

  fill = (color) => {
    const activeObject = this.getActiveObject();
    const canvas = this.getCanvas();
    if(activeObject){
      if(activeObject.type === 'line'){
        activeObject.set({
          stroke : convertRGB(color.rgb)
        })
      }
      else {
        activeObject.set({
          fill : convertRGB(color.rgb)
        })
      }

      this.saveState('Fill ' + activeObject.type);
      canvas.renderAll();
    }

  }
}

export default Fill;
