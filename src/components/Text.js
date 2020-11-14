import Action from './Action';

class Text extends Action {
  constructor(App) {
    super('Text', App);
  }
  textObj = (activeObject, option, checked, value) => {
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
          textBackgroundColor : value
        }).setCoords();
        break;
      default:
    }
    canvas.renderAll();
  }


  textAlign = () => {

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