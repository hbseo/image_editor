import Action from './Action';
class Shape extends Action {
    constructor(App) {
      super('Shape', App);
    }

    setStroke = (obj, options) => {
        const canvas = this.getCanvas();
        obj.set({
            stroke : options.strokeColor|| null,
            strokeWidth : options.strokeWidth || null
        })
        if(options.strokeWidth === 0){
            obj.set({stroke : null});
        }
        canvas.renderAll();
    }

  }
  
  export default Shape;