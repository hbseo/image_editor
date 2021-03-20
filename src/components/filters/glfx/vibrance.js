import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;

filters.Vibrance = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
    type: 'Vibrance',
    
    fragmentSource:'precision highp float;\n' +
    'uniform sampler2D texture;\n' +
    'uniform float amount;\n'+
    'varying vec2 vTexCoord;\n'+
    'void main() {\n' +
      'vec4 color = texture2D(texture, vTexCoord);\n' +
      'float average = (color.r + color.g + color.b) / 3.0;\n' +
      'float mx = max(color.r, max(color.g, color.b));\n' +
      'float amt = (mx - average) * (-amount * 3.0);\n '+
      'color.rgb = mix(color.rgb, vec3(mx), amt);\n' +
      'gl_FragColor = color;\n' +
    '}',


    
    mainParameter: 'amount',

    amount : 0,


    applyTo2d: function(options) {
      // var imageData = options.imageData,
      //     data = imageData.data, i,
      //     len = data.length;
    },

    isNeutralState: function() {
      return false
    },


    getUniformLocations: function(gl, program) {
      return {
        amount : gl.getUniformLocation(program, 'amount'),
      };
    },

    sendUniformData: function(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.amount, this.amount);
    },

  });

fabric.Image.filters.Vibrance.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const Vibrance = filters.Vibrance