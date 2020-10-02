import Action from './Action';
import { fabric } from 'fabric';

class Text extends Action {
  constructor(App) {
    super('Text', App);
    this.state = {
      backgroundcolor: '',
      bordercolor: '',
      angle: 0,
      fill: '',
      fontfamily: '',
      fontsize: '',
      fontstyle: ''
    }
  }
  addText = () => {
    const canvas = this.getCanvas();
    let text = new fabric.Textbox('Hello world', {
      left: 100, top: 100
    });
    canvas.add(text);
  }
  textObj = (activeObject, option, checked) => {
    const canvas = this.getCanvas();
    const activeObj = this.getActiveObject();
    switch (option) {
      case 'bold':
        if (checked) {
          activeObj.set({
            fontWeight: 'bold',
          }).setCoords();
        }
        else {
          activeObj.set({
            fontWeight: 'normal',
          }).setCoords();
        }
        break;
      case 'color':
        if (checked) {
          activeObj.set({
            fill: 'blue',
          }).setCoords();
        }
        else {
          activeObj.set({
            fill: 'black',
          }).setCoords();
        }
        break;
      default:
    }
    canvas.renderAll();
  }
}

export default Text;

/* Text
    backgroundColor : string
    borderColor : string
    angle : number
    cursorColor : string
    editable : boolean
    fill : string - 글자색
    fontFamily : string
    fontSize : number
    fontStyle : string (normal, italic ...)
    fontWeight : number|string ( bold, normal, 400 ...)

  */