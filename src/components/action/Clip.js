import Action from './Action';

class Clip extends Action {
  constructor(App) {
    super('Clip', App);
  }

  copyObject = () => {
    if(this.getActiveObject()){
      this.getActiveObject().clone((cloned) => {
        this.setClipboard(cloned);
      });
    }
  }

  pasteObject = () => {
    const canvas = this.getCanvas();
    let clipboard = this.getClipboard();
    clipboard.clone((clonedObj) => {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function(obj) {
          canvas.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      clipboard.top += 10;
      clipboard.left += 10;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  }

}

export default Clip;