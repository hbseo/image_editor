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

  changeOpacity = (opacity) => {
    // const activeObject = this.getActiveObject();
    // const canvas = this.getCanvas();
    // let origin = activeObject.type === 'line' ? activeObject.stroke : activeObject.fill;
    
    // `rgba` 형태로 값을 받아서.. 어떻게 r,g,b를 구분?
    
  //   if(activeObject){
  //     if(activeObject.type === 'line'){
  //       activeObject.set({
  //         stroke : convertRGB(color.rgb)
  //       })
  //     }
  //     else {
  //       activeObject.set({
  //         fill : convertRGB(color.rgb)
  //       })
  //     }

  //     this.saveState('Fill opacity ' + activeObject.type);
  //     canvas.renderAll();
  //   }
  }
}

export default Fill;
