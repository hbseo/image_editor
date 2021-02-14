import Extension from './Extension';
import { fabric } from 'fabric';
class Pipette extends Extension {
  constructor(App) {
    super('Pipette', App);
  }

  enablePipette = () => {
    document.addEventListener('mousedown', this.pipetteEvent);
  }

  disablePipette = () => {
    document.removeEventListener('mousedown', this.pipetteEvent);
  }

  pipetteEvent = (event) => {
    if(event.target.tagName === 'CANVAS') { 
      const pointer = this._canvas.getPointer(event, true);
      let context = document.getElementById('canvas').getContext('2d');
      let data = context.getImageData(pointer.x * fabric.devicePixelRatio , pointer.y * fabric.devicePixelRatio, 1, 1).data; 
      this.setState({pipette : false, pipetteRGB:{ r:data[0],g:data[1],b:data[2]}, color : {r:data[0],g:data[1],b:data[2], a:1}});
    }
    document.removeEventListener('mousedown', this.pipetteEvent);
  }

    

}
  
export default Pipette;