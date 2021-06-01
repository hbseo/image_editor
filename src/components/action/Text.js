import Action from './Action';
import { fabric } from 'fabric';

class Text extends Action {
  constructor(App) {
    super('Text', App);
    this.addTextOpt = null;
  }

  addTextEvent = (event) => {
    const canvas = this.getCanvas();
    const pointer = canvas.getPointer(event, false)
    if(event.target.tagName === 'CANVAS'){
      let text = new fabric.Textbox('Double Click', {
        left: pointer.x,
        top: pointer.y,
        fontSize: this.addTextOpt.size,
        fontFamily : this.addTextOpt.font,
        fill : this.addTextOpt.color,
        lockScalingY: true,
        strokeWidth : 0,
        textBackgroundColor : null,
        cornerStrokeColor : "grey",
        borderColor : "grey"
      });
      text.setControlsVisibility({
        mt: false,
        mb: false,
        bl: false,
        br: false,
        tl: false,
        tr: false
      });
      canvas.add(text).setActiveObject(text);
      this.saveState('text add');
    }
    document.removeEventListener('mousedown', this.addTextEvent);
    canvas.defaultCursor = 'default';
  }

  addText = (option) => {
    this.addTextOpt = option;
    this.getCanvas().defaultCursor = 'pointer';
		document.addEventListener('mousedown',this.addTextEvent);    
  }

  textObj = (activeObject, option, checked, value) => {
    if(!activeObject){
      return ;
    }
    else{
      const canvas = this.getCanvas();
      switch (option) {
        case 'bold':
          activeObject.set({
            fontWeight: checked ? 'bold' : 'normal'
          }).setCoords();
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
        case 'italic':
          activeObject.set({
            fontStyle: checked ? 'italic' : 'normal'
          }).setCoords();
          break;
        case 'underline':
          activeObject.set({
            underline: checked ? 'true' : ''
          }).setCoords();
          break;
        case 'left-align':
          activeObject.set({
            textAlign: 'left'
          }).setCoords();
          break;
        case 'center-align':
          activeObject.set({
            textAlign: 'center'
          }).setCoords();
          break;
        case 'right-align':
          activeObject.set({
            textAlign: 'right'
          }).setCoords();
          break;
        case 'background-color':
          activeObject.set({
            textBackgroundColor : checked ? value : null
          }).setCoords();
          break;
        default:
      }
      this.saveState('Text modified ' + option);
      canvas.renderAll();
    }
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