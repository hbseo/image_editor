import Action from './Action';

class Delete extends Action {
  constructor(App) {
    super('Delete', App);
  }

  deleteObj = () => {
    let canvas = this.getCanvas();
    let obj = canvas.getActiveObject();
    if(obj) {
      if(obj.type === 'activeSelection') {
        for(let i in obj._objects) {
          canvas.remove(obj._objects[i]);
        }
        canvas.discardActiveObject();
      }
      else {
        if(obj.type === 'textbox') {
          if(!obj.__lastIsEditing) {
            canvas.remove(obj);
          }
        }

        else {
          canvas.remove(obj);
        }
      }
      canvas.renderAll();
    }
  }

}

export default Delete;

