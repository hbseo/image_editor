import Action from './Action';

import { fabric } from 'fabric';

class Filter extends Action {
  constructor(App) {
    super('Filter', App);
  }

  applyFilter = (obj, option, checked, value) => {
    let canvas = this.getCanvas();
    if (!obj.hasOwnProperty('_objects')) {
      switch (option) {
        case 'grey':
          obj.filters[0] = checked && (new fabric.Image.filters.Grayscale());
          break;
        case 'invert':
          obj.filters[1] = checked && (new fabric.Image.filters.Invert());
          break;
        case 'brightness':
          obj.filters[5] = (new fabric.Image.filters.Brightness({
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

