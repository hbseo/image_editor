import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;

filters.hueSaturation = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
    type: 'hueSaturation',
    
    fragmentSource:'precision highp float;\n' +
    'uniform sampler2D texture;\n' +
    'uniform float hue;\n' +
    'uniform float saturation;\n'+
    'varying vec2 vTexCoord;\n'+
    'void main() {\n' +
      'vec4 color = texture2D(texture, vTexCoord);\n' +
      'float angle = hue * 3.14159265;\n' +
      'float s = sin(angle), c = cos(angle);\n' +
      'vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;\n'+
      'float len = length(color.rgb);\n'+
      'color.rgb = vec3(\n'+
          'dot(color.rgb, weights.xyz),\n'+
          'dot(color.rgb, weights.zxy),\n'+
          'dot(color.rgb, weights.yzx)\n'+
      ');\n'+
      '\n'+
      'float average = (color.r + color.g + color.b) / 3.0;\n'+
      'if (saturation > 0.0) {\n'+
          'color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));\n'+
      '} else {\n'+
          'color.rgb += (average - color.rgb) * (-saturation);\n'+
      '}\n'+
      'gl_FragColor = color;\n'+
    '}',


    
    mainParameter: 'hueSaturation_matrix',

    hueSaturation_matrix : {
      hue : 0,
      saturation : 0
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
        hue : gl.getUniformLocation(program, 'hue'),
        saturation : gl.getUniformLocation(program, 'saturation'),
      };
    },

    sendUniformData: function(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.hue, this.hueSaturation_matrix.hue);
      gl.uniform1f(uniformLocations.saturation, this.hueSaturation_matrix.saturation);
    },

  });

fabric.Image.filters.hueSaturation.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const hueSaturation = filters.hueSaturation