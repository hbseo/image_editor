import Action from './Action';

import { fabric } from 'fabric';

class Filter extends Action {
    constructor(App){
      super('Filter', App);
      // console.log(App,"-asfdjasdhjfjkahslkdf", this);
    }

    applyFilter = (obj, option, checked) => {
      let canvas = this.getCanvas();
      switch(option){
        case 'grey':
          obj.filters[0] = checked && (new fabric.Image.filters.Grayscale());
          // obj.filters[0] = checked ? (new fabric.Image.filters.Grayscale()) : null;
          obj.applyFilters();
          break;
          
        case 'vintage':
          obj.filters[9] = checked && (new fabric.Image.filters.Vintage());
          // obj.filters[9] = checked ? (new fabric.Image.filters.Vintage()) : null;
          obj.applyFilters();
          break;
  
        default:
      }

      console.log(obj.filters);
      canvas.renderAll();
    }
    

}

export default Filter;

