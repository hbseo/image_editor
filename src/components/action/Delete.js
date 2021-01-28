import Action from './Action';

class Delete extends Action {
  constructor(App) {
    super('Delete', App);
  }

  deleteObject = () => {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      switch(obj.type){
        case 'textbox' : 
          if(!this.getActiveObject().isEditing){
            canvas.remove(obj);
            this.getImageEditor().saveState('delete Textbox');
          }
          break;
        case 'activeSelection':
          for(let i in obj._objects) {
            canvas.remove(obj._objects[i]);
          }
          canvas.discardActiveObject();
          this.getImageEditor().saveState('delete activeSelection');
          break;
        default :
          canvas.remove(obj);
          this.getImageEditor().saveState('delete '+ obj.type);
      }
      canvas.renderAll();
    }
  }

  deleteAllObject = () => {
    const canvas = this.getCanvas();
    canvas.remove(...canvas.getObjects());
    this.getImageEditor().saveState('clear canvas');
    canvas.renderAll();
  }

}

export default Delete;

