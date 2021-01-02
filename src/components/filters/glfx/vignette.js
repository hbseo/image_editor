import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;

filters.Vignette = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
    type: 'Vignette',
    
    fragmentSource:'precision highp float;\n' +
    'uniform sampler2D texture;\n' +
    'uniform float size;\n' +
    'uniform float amount;\n'+
    'varying vec2 vTexCoord;\n'+
    'void main() {\n' +
      'vec4 color = texture2D(texture, vTexCoord);\n' +
      'float dist = distance(vTexCoord, vec2(0.5, 0.5));\n' +
      'color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));\n' +
      'gl_FragColor = color;\n' +
    '}',


    
    mainParameter: 'vignette_matrix',

    vignette_matrix : {
      size : 0,
      amount : 0
    },


    applyTo2d: function(options) {
      var imageData = options.imageData,
          data = imageData.data, i,
          len = data.length;
      for (i = 0; i < len; i += 4) {
        // data[i] = 255 - data[i];
        // data[i + 1] = 255 - data[i + 1];
        // data[i + 2] = 255 - data[i + 2];
      }
    },

    isNeutralState: function() {
      return false
    },


    getUniformLocations: function(gl, program) {
      return {
        size : gl.getUniformLocation(program, 'size'),
        amount : gl.getUniformLocation(program, 'amount'),
      };
    },

    sendUniformData: function(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.size, this.vignette_matrix.size);
      gl.uniform1f(uniformLocations.amount, this.vignette_matrix.amount);
    },

  });

fabric.Image.filters.Vignette.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const Vignette = filters.Vignette