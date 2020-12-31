import Action from './Action';
import { Ink } from '../filters/glfx/ink.js'
import { Vignette } from '../filters/glfx/vignette.js'
import { fabric } from 'fabric';

class Filter extends Action {
  constructor(App) {
    super('Filter', App);
    console.log()
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
        case 'emboss':
          obj.filters[9] = checked && (new fabric.Image.filters.Convolute({
            matrix :  [ 1,   1,  1,
                        1, 0.7, -1,
                       -1,  -1, -1 ]
          }));
          break;
        case 'brightness':
          obj.filters[15] = (new fabric.Image.filters.Brightness({
            brightness: value
          }));
          break;
        case 'contrast':
          obj.filters[16] = (new fabric.Image.filters.Contrast({
            contrast: value
          }));
          break;
        case 'pixelate':
          obj.filters[17] = (new fabric.Image.filters.Pixelate({
            blocksize : value
          }));
          break;
        case 'blur':
          obj.filters[18] = (new fabric.Image.filters.Blur({
            blur : value
          }));
          break;
        case 'noise':
          obj.filters[19] = (new fabric.Image.filters.Noise({
            noise : value
          }));
          break;          
        case 'saturation':
          obj.filters[20] = (new fabric.Image.filters.Saturation({
            saturation : value
          }));
          break;
        case 'hue':
          obj.filters[21] = (new fabric.Image.filters.HueRotation({
            rotation : value
          }));
          break;
        case 'ink':
          obj.filters[22] = (new Ink({
            ink_matrix : {
              ink : value * value * value * value * value,
              width : obj.width,
              height : obj.height
            }
          }));
          break;
        case 'vignette':
          obj.filters[23] = (new Vignette({
            vignette_matrix : {
              size :  0.66,
              amount : value
            }
          }));
          break;
        case 'opacity':
          obj.opacity = value;
          break;

        default:
      }
      obj.applyFilters();
    }
    canvas.renderAll();
  }


}

export default Filter;

