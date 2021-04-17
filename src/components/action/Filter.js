import Action from './Action';
import { Ink } from '../filters/glfx/ink.js'
import { Vignette } from '../filters/glfx/vignette.js'
import { ZoomBlur } from '../filters/glfx/zoomblur.js'
import { Vibrance } from '../filters/glfx/vibrance.js'
import { hueSaturation } from '../filters/glfx/hueSaturation.js'
import { Denoise } from '../filters/glfx/denoise.js'
import { HexagonalPixelate } from '../filters/glfx/hexagonalPixelate.js' 
import { TiltShift } from '../filters/glfx/tiltshift.js' 
import { fabric } from 'fabric';

class Filter extends Action {
  constructor(App) {
    super('Filter', App);
    fabric.filterBackend  = new fabric.WebglFilterBackend()
    fabric.isWebglSupported(fabric.textureSize);
  }

  previewFilter = (obj, option) => {
    if(obj && obj.type  === 'image') {
      obj.clone((cloned) => {
        cloned.filters[1] = new fabric.Image.filters.Invert();
        console.log(cloned.src)
      });
    } 
    else{
      return 'test'
    }
  }

  applyFilter = (obj, option, checked, value) => {
    let canvas = this.getCanvas();
    // var timeStart = +new Date();
    if (obj.type === "image") {
      switch (option) {
        case 'invert':
          obj.filters[0] = checked && (new fabric.Image.filters.Invert());
          break;
        case 'brownie':
          obj.filters[1] = checked && (new fabric.Image.filters.Brownie());
          break;
        case 'technicolor':
          obj.filters[2] = checked && (new fabric.Image.filters.Technicolor());
          break;
        case 'polaroid':
          obj.filters[3] = checked && (new fabric.Image.filters.Polaroid());
          break;
        case 'blackwhite':
          obj.filters[4] = checked && (new fabric.Image.filters.BlackWhite());
          break;
        case 'vintage':
          obj.filters[5] = checked && (new fabric.Image.filters.Vintage());
          break;
        case 'sepia':
          obj.filters[6] = checked && (new fabric.Image.filters.Sepia());
          break;
        case 'kodachrome':
          obj.filters[7] = checked && (new fabric.Image.filters.Kodachrome());
          break;
        case 'emboss':
          obj.filters[8] = checked && (new fabric.Image.filters.Convolute({
            matrix :  [ 1,   1,  1,
                        1, 0.7, -1,
                       -1,  -1, -1 ]
          }));
          break;
        case 'sharpen':
          obj.filters[9] = checked && (new fabric.Image.filters.Convolute({
            matrix: [  0, -1,  0,
                      -1,  5, -1,
                       0, -1,  0 ]
          }));
          break;
        // case 'resize':
        //   obj.filters[11] = (new fabric.Image.filters.Resize({
        //     resizeType: 'sliceHack',
        //     scaleX : 0.2,
        //     scaleY : 0.2
        //   }));
        //   break;
        case 'grayscale':
          obj.filters[10] = checked && (new fabric.Image.filters.Grayscale({
            mode : gray_mode[value]
          }));
          break;
        case 'brightness':
          obj.filters[11] = checked && (new fabric.Image.filters.Brightness({
            brightness: value
          }));
          break;
        case 'contrast':
          obj.filters[12] = checked && (new fabric.Image.filters.Contrast({
            contrast: value
          }));
          break;
        case 'pixelate':
          obj.filters[13] = checked && (new fabric.Image.filters.Pixelate({
            blocksize : value
          }));
          break;
        case 'blur':
          obj.filters[14] = checked && (new fabric.Image.filters.Blur({
            blur : value
          }));
          break;
        case 'noise':
          obj.filters[15] = checked && (new fabric.Image.filters.Noise({
            noise : value
          }));
          break;          
        case 'saturation':
          obj.filters[16] = checked && (new fabric.Image.filters.Saturation({
            saturation : value
          }));
          break;
        case 'huerotation':
          obj.filters[17] = checked && (new fabric.Image.filters.HueRotation({
            rotation : value
          }));
          break;
        case 'ink':
          obj.filters[18] = checked && (new Ink({
            ink_matrix : {
              ink : value ,
              width : obj.width,
              height : obj.height
            }
          }));
          break;
        case 'vignette':
          obj.filters[19] = checked && (new Vignette({
            vignette_matrix : {
              size :  0.66,
              amount : value
            }
          }));
          break;
        case 'zoomblur':
          obj.filters[20] = checked && (new ZoomBlur({
            zoomblur_matrix : {
              center_x : obj.width/2, // Controllable
              center_y : obj.height/2, // Controllable
              strength : value,
              width : obj.width,
              height : obj.height
            }
          }));
          break;
        case 'vibrance':
          obj.filters[21] = checked && (new Vibrance({
            amount : value
          }));
          break;
        case 'denoise':
          obj.filters[22] = checked && (new Denoise({
            denoise_matrix : {
              exponent : value,
              width : obj.width,
              height : obj.height
            }
          }));
          break;
        case 'removecolor':
          // console.log(checked, value)
          obj.filters[23] = checked && (new fabric.Image.filters.RemoveColor({
            distance: value.distance,
            color: value.color,
          }));
          break;
        case 'blendcolor':
          // console.log(value)
          obj.filters[24] = checked && (new fabric.Image.filters.BlendColor({
            color: value.color,
            mode: value.mode,
            alpha: value.alpha
          }));
          // console.log(obj.filters)
          break;
        case 'gamma':
          obj.filters[25] = checked && (new fabric.Image.filters.Gamma({
            gamma : [parseFloat(value.r), parseFloat(value.g), parseFloat(value.b)]
          }));
          break;
        case 'huesaturation':
          obj.filters[26] = checked && (new hueSaturation({
            hueSaturation_matrix : {
              hue : 0,
              saturation : value
            }
          }));
          break;
        case 'tiltshift':
          // var endX = 1;
          // var endY = obj.height / 2;
          // var startX = obj.width - 1;
          // var startY = obj.height / 2;

          var startX = obj.width / 4;
          var startY =  obj.height / 2;
          var endX = obj.width / 4 * 3;
          var endY = obj.height / 2;


          var dx = endX - startX;
          var dy = endY - startY;
          var d = Math.sqrt(dx * dx + dy * dy);
          obj.filters[27] = checked && (new TiltShift({  
            tiltshift_matrix : {
              blurRadius: value,
              gradientRadius: 150,
              start: [startX, startY],
              end: [endX, endY],
              delta: [dx / d, dy / d],
              texSize: [obj.width, obj.height]
            }
          }));
          break;
        case 'hexagonalpixelate':
          obj.filters[28] = checked && (new HexagonalPixelate({
            hexagonal_matrix : {
              center : [obj.width / 2, obj.height / 2],
              scale : value,
              width: obj.width,
              height : obj.height
            }
          }));
          break;
        case 'opacity':
          obj.opacity = value;
          break;

        default:
      }
      this.saveState(checked ? 'apply filter ' + option : 'off filter ' + option);
      this.updateObject();
      obj.applyFilters();
      // var timeEnd = +new Date();
      // console.log(parseFloat(timeEnd-timeStart) + 'ms');
    }
    canvas.renderAll();
  }


}

export default Filter;

const gray_mode = ['average', 'luminosity', 'lightness']

/*
 applyfiltervalue ( index, prop, value)
 obj.filters[index][prop] = value;


 0번 인덱스, grayScale
  $('average').onclick = function() {
    applyFilterValue(0, 'mode', 'average');
  };
  $('luminosity').onclick = function() {
    applyFilterValue(0, 'mode', 'luminosity');
  };
  $('lightness').onclick = function() {
    applyFilterValue(0, 'mode', 'lightness');
  };

2번 인덱스 : removeColor 필터
$('remove-color-color').onchange = function() {
    applyFilterValue(2, 'color', this.value);
  };
  $('remove-color-distance').oninput = function() {
    applyFilterValue(2, 'distance', this.value);
  };


17번 인덱스 : gamma필터
    $('gamma').onclick = function () {
    var v1 = parseFloat($('gamma-red').value);
    var v2 = parseFloat($('gamma-green').value);
    var v3 = parseFloat($('gamma-blue').value);
    applyFilter(17, this.checked && new f.Gamma({
      gamma: [v1, v2, v3]
    }));
  };
  $('gamma-red').oninput = function() {
    var current = getFilter(17).gamma;
    current[0] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-green').oninput = function() {
    var current = getFilter(17).gamma;
    current[1] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-blue').oninput = function() {
    var current = getFilter(17).gamma;
    current[2] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };

*/