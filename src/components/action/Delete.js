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
            this.saveState('delete Textbox');
          }
          break;
        case 'activeSelection':
          for(let i in obj._objects) {
            canvas.remove(obj._objects[i]);
          }
          canvas.discardActiveObject();
          this.saveState('delete activeSelection');
          break;
        default :
          canvas.remove(obj);
          console.log(obj);
          console.log(obj.type);
          if(obj.type === "path") {
            if(obj.fill === null) this.saveState('delete draw');
            else this.saveState('delete path')
          }
          else if(obj.type === "group") this.saveState('delete draw');
          else this.saveState('delete ' + obj.type);
      }
      canvas.renderAll();
    }
  }

  deleteAllObject = () => {
    const canvas = this.getCanvas();
    canvas.remove(...canvas.getObjects());
    this.saveState('clear canvas');
    canvas.renderAll();
  }

}

export default Delete;

