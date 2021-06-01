import Action from './Action';

class Clip extends Action {
  constructor(App) {
    super('Clip', App);
  }

  /**
   * Copy Objects
   * @param {Object} obj 
   */
  copyObject = (obj) => {
    if(obj){
      obj.clone((cloned) => {
        this.setClipboard(cloned);
      });
    }
  }

  /**
   * Paset Object on Canvas
   */
  pasteObject = () => {
    const canvas = this.getCanvas();
    let clipboard = this.getClipboard();
    clipboard.clone((clonedObj) => {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
        cornerStrokeColor : "grey",
        borderColor : "grey"
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
      this.saveState('paste object')
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  }

}

export default Clip;