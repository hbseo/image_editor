import Extension from './Extension';
import { fabric } from 'fabric';
class Pipette extends Extension {
  constructor(App) {
    super('Pipette', App);
    this.color = { r : 255, g: 255, b: 255, a: 1 };
    this.setColor = null;
  }

  enablePipette = (setColor) => {
    this.getCanvas().defaultCursor = 'pointer';
    this.setColor = setColor;
    document.addEventListener('mousedown', this.pipetteEvent);
  }

  disablePipette = () => {
    document.removeEventListener('mousedown', this.pipetteEvent);
    this.getCanvas().defaultCursor = 'default';
  }

  pipetteEvent = (event) => {
    if(event.target.tagName === 'CANVAS') { 
      const pointer = this.getCanvas().getPointer(event, true);
      let context = document.getElementById('canvas').getContext('2d');
      let data = context.getImageData(pointer.x * fabric.devicePixelRatio , pointer.y * fabric.devicePixelRatio, 1, 1).data; 
      this.color = {r:data[0],g:data[1],b:data[2], a:1};
      this.setColor(this.color)
      // this.setState({pipette : false, pipetteRGB:{ r:data[0],g:data[1],b:data[2]}, color : {r:data[0],g:data[1],b:data[2], a:1}});
    }
    this.disablePipette();
  }   
}
  
export default Pipette;