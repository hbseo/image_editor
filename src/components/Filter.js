import Action from './Action';

import { fabric } from 'fabric';

class Filter extends Action {
    constructor(App){
      super('Filter', App);
    }

    applyFilter = (obj, option, checked) => {
      let canvas = this.getCanvas();
      let len = 1;
      if(obj.hasOwnProperty('_objects')) {
        len = obj._objects.length;
        for(let i = 0; i<len; i++) {
          switch(option){
            case 'grey':
              obj._objects[i].filters[0] = checked && (new fabric.Image.filters.Grayscale());
              obj._objects[i].applyFilters();
              break;
              
            case 'vintage':
              obj._objects[i].filters[9] = checked && (new fabric.Image.filters.Vintage());
              obj._objects[i].applyFilters();
              break;
      
            default:
          }
        }
      }
      else {
        switch(option){
          case 'grey':
            obj.filters[0] = checked && (new fabric.Image.filters.Grayscale());
            obj.applyFilters();
            break;
            
          case 'vintage':
            obj.filters[9] = checked && (new fabric.Image.filters.Vintage());
            obj.applyFilters();
            break;
    
          default:
        }
      }
      canvas.renderAll();
    }
    

}

export default Filter;

