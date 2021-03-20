import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;

filters.Denoise = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
  type: 'Denoise',
  
  fragmentSource:'precision highp float;\n' +
  'uniform sampler2D texture;\n' +
  'uniform float exponent;\n'+
  'uniform float strength;\n'+
  'uniform vec2 texSize;\n'+
  'varying vec2 vTexCoord;\n'+
  'void main() {\n' +
    'vec4 center = texture2D(texture, vTexCoord);\n' +
    'vec4 color = vec4(0.0);\n' +
    'float total = 0.0;\n' +
    'for (float x = -4.0; x <= 4.0; x += 1.0) {\n '+
      'for (float y = -4.0; y <= 4.0; y += 1.0) {\n' +
        'vec4 sample = texture2D(texture, vTexCoord + vec2(x, y) / texSize);\n' +
        'float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));\n' +
        'weight = pow(weight, exponent);\n' +
        'color += sample * weight;\n' +
        'total += weight;\n' +
			'}\n' +
		'}\n' +
    'gl_FragColor = color / total;\n' +
  '}',
  
  mainParameter: 'denoise_matrix',

  denoise_matrix : {
    exponent : 0,
    width: 0,
    height : 0
  },

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
			exponent : gl.getUniformLocation(program, 'exponent'),
			texSize : gl.getUniformLocation(program, 'texSize'),
    };
  },

  sendUniformData: function(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.exponent, this.denoise_matrix.exponent);
    gl.uniform2fv(uniformLocations.texSize, [this.denoise_matrix.width, this.denoise_matrix.height]); // max size 
  },

});

fabric.Image.filters.Denoise.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const Denoise = filters.Denoise