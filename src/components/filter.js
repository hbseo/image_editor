import Action from './Action';

import { fabric } from 'fabric';

class Filter extends Action {
    constructor(App){
      super('Filter', App);
      // console.log(App,"-asfdjasdhjfjkahslkdf", this);
    }

    applyFilter = () => {
      console.log(this)
      let canvas = this.getCanvas();
      let obj = canvas.getActiveObject();
      if(obj) {
        if(obj.filters.length === 0) {
          obj.filters.push(new fabric.Image.filters.Grayscale());
          obj.applyFilters();
        }
        else {
          obj.filters.pop();
          obj.applyFilters();
        }
        canvas.renderAll();
      }
      else {
        alert('image is not activated');
      }
    }

}

export default Filter;

