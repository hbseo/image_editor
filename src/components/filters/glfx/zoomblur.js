import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;


filters.ZoomBlur = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
    type: 'ZoomBlur',
    
    fragmentSource:'precision highp float;\n' +
    'uniform sampler2D texture;\n' +
    'uniform vec2 center;\n' +
    'uniform float strength;\n'+
    'uniform vec2 texSize;\n'+
    'varying vec2 vTexCoord;\n'+
    'float random(vec3 scale, float seed) {\n'+
      'return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n'+
    '}\n'+
    'void main() {\n' +
      'vec4 color = vec4(0.0);\n' +
      'float total = 0.0;\n' +
      'vec2 toCenter = center - vTexCoord * texSize;\n' +
      'float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n' +
      'for (float t = 0.0; t <= 40.0; t++) {\n' +
        'float percent = (t + offset) / 40.0;\n' +
        'float weight = 4.0 * (percent - percent * percent);\n' +
        'vec4 sample = texture2D(texture, vTexCoord + toCenter * percent * strength / texSize);\n' +
        'sample.rgb *= sample.a;\n' +
        'color += sample * weight;\n' +
        'total += weight;\n' +
      '}\n' +
      'gl_FragColor = color / total;\n' +
      'gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n' +
    '}',


    
    mainParameter: 'zoomblur_matrix',

    zoomblur_matrix : {
      center_x : 0,
      center_y : 0,
      strength : 0,
      width: 0,
      height : 0
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
        center : gl.getUniformLocation(program, 'center'),
        strength : gl.getUniformLocation(program, 'strength'),
        texSize : gl.getUniformLocation(program, 'texSize'),
      };
    },

    sendUniformData: function(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.strength, this.zoomblur_matrix.strength);
      gl.uniform2fv(uniformLocations.texSize, [this.zoomblur_matrix.width, this.zoomblur_matrix.height]);
      gl.uniform2fv(uniformLocations.center, [this.zoomblur_matrix.center_x, this.zoomblur_matrix.center_y]); 
    },

  });

fabric.Image.filters.ZoomBlur.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const ZoomBlur = filters.ZoomBlur