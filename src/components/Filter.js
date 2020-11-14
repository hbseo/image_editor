import Action from './Action';

import { fabric } from 'fabric';

class Filter extends Action {
  constructor(App) {
    super('Filter', App);
  }

  applyFilter = (obj, option, checked, value) => {
    let canvas = this.getCanvas();
    if (obj.type === "image") {
      switch (option) {
        case 'grey':
          obj.filters[0] = checked && (new fabric.Image.filters.Grayscale());
          break;
        case 'invert':
          obj.filters[1] = checked && (new fabric.Image.filters.Invert());
          break;
        case 'brownie':
          obj.filters[2] = checked && (new fabric.Image.filters.Brownie());
          break;
        case 'technicolor':
          obj.filters[3] = checked && (new fabric.Image.filters.Technicolor());
          break;
        case 'polaroid':
          obj.filters[4] = checked && (new fabric.Image.filters.Polaroid());
          break;
        case 'blackwhite':
          obj.filters[5] = checked && (new fabric.Image.filters.BlackWhite());
          break;
        case 'vintage':
          obj.filters[6] = checked && (new fabric.Image.filters.Vintage());
          break;
        case 'sepia':
          obj.filters[7] = checked && (new fabric.Image.filters.Sepia());
          break;
        case 'kodachrome':
          obj.filters[8] = checked && (new fabric.Image.filters.Kodachrome());
          break;
        case 'brightness':
          obj.filters[9] = (new fabric.Image.filters.Brightness({
            brightness: value
          }));
          break;
        case 'contrast':
          obj.filters[10] = (new fabric.Image.filters.Contrast({
            contrast: value
          }));
          break;
        case 'pixelate':
          obj.filters[11] = (new fabric.Image.filters.Pixelate({
            blocksize : value
          }));
          break;
        case 'blur':
          obj.filters[12] = (new fabric.Image.filters.Blur({
            blur : value
          }));
          break;
          

        default:
      }
      obj.applyFilters();
    }
    canvas.renderAll();
  }


}

export default Filter;

