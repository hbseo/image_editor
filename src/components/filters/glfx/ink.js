import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;


filters.Ink = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
    type: 'Ink',
    
    fragmentSource:'precision highp float;\n' +
    'uniform sampler2D texture;\n' +
    'uniform float uInk;\n' +
    'uniform vec2 texSize;\n'+
    'varying vec2 vTexCoord;\n'+
    'void main() {\n' +
      'vec2 dx = vec2(1.0 / texSize.x, 0.0);\n' +
      'vec2 dy = vec2(0.0, 1.0 / texSize.y);\n' +
      'vec4 color = texture2D(texture, vTexCoord);\n' +
      'float bigTotal = 0.0;\n' +
      'float smallTotal = 0.0;\n' +
      'vec3 bigAverage = vec3(0.0);\n' +
      'vec3 smallAverage = vec3(0.0);\n' +
      'for (float x = -2.0; x <= 2.0; x += 1.0) {\n' +
        'for (float y = -2.0; y <= 2.0; y += 1.0) {\n' +
          'vec3 sample = texture2D(texture, vTexCoord + dx * x + dy * y).rgb;\n' +
          'bigAverage += sample;\n' +
          'bigTotal += 1.0;\n' +
          'if (abs(x) + abs(y) < 2.0) {\n' +
            'smallAverage += sample;\n' +
            'smallTotal += 1.0;\n' +
          '}\n' +
        '}\n' +
      '}\n' +
      'vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);\n' +
      'gl_FragColor = vec4(color.rgb - dot(edge, edge) * uInk * 100000.0, color.a);\n' +
    '}',


    
    mainParameter: 'ink_matrix',

    ink_matrix : {
      ink : 0,
      width: 0,
      height : 0
    },


    applyTo2d: function(options) {
      console.log(options.canvasEl)
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
        uInk : gl.getUniformLocation(program, 'uInk'),
        texSize : gl.getUniformLocation(program, 'texSize'),
      };
    },

    sendUniformData: function(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.uInk, Math.pow(this.ink_matrix.ink, 5));
      gl.uniform2fv(uniformLocations.texSize, [this.ink_matrix.width, this.ink_matrix.height]); // max size 
    },

  });

fabric.Image.filters.Ink.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const Ink = filters.Ink