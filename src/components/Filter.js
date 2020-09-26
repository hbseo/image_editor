import Action from './Action';

import { fabric } from 'fabric';

class Filter extends Action {
    constructor(App){
      super('Filter', App);
    }

    applyFilter = (obj, option, checked, value) => {
      console.log(value);
      let canvas = this.getCanvas();
      if(obj.hasOwnProperty('_objects')) {
        let len = obj._objects.length;
        for(let i = 0; i<len; i++) {
          switch(option){
            case 'grey':
              obj._objects[i].filters[0] = checked && (new fabric.Image.filters.Grayscale());
              break;
            case 'invert':
              obj._objects[i].filters[1] = checked && (new fabric.Image.filters.Invert());
              break;  
            case 'vintage':
              obj._objects[i].filters[9] = checked && (new fabric.Image.filters.Vintage());
              break;
      
            default:
          }
          obj._objects[i].applyFilters();
        }
      }
      else {
        switch(option){
          case 'grey':
            obj.filters[0] = checked && (new fabric.Image.filters.Grayscale());
            break;
          case 'invert':
            obj.filters[1] = checked && (new fabric.Image.filters.Invert());
            break;  
          case 'brightness':
            console.log(value);
            obj.filters[5] = checked && (new fabric.Image.filters.Brightness({
              brightness: value
            }));
            break;  
          case 'vintage':
            obj.filters[9] = checked && (new fabric.Image.filters.Vintage());
            break;
    
          default:
        }
        obj.applyFilters();
      }
      canvas.renderAll();
    }
    

}

export default Filter;

