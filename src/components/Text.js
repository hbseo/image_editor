import Action from './Action';
import { fabric } from 'fabric';

class Text extends Action {
  constructor(App) {
    super('Text', App);
  }
  addText = () => {
    const canvas = this.getCanvas();
    let text = new fabric.Textbox('Hello world', {
      left: 100, top: 100, fontSize: 50
    });
    canvas.add(text).setActiveObject(text);
  }
  textObj = (activeObject, option, checked, value) => {
    const canvas = this.getCanvas();
    switch (option) {
      case 'bold':
        if (checked) {
          activeObject.set({
            fontWeight: 'bold'
          }).setCoords();
        }
        else {
          activeObject.set({
            fontWeight: 'normal'
          }).setCoords();
        }
        break;
      case 'color':
        if (checked) {
          activeObject.set({
            fill: 'blue'
          }).setCoords();
        }
        else {
          activeObject.set({
            fill: 'black'
          }).setCoords();
        }
        break;
      case 'fontSize':
        activeObject.set({
          fontSize: value
        }).setCoords();
        break;
      case 'fontfamily':
        activeObject.set({
          fontFamily: value
        }).setCoords();
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