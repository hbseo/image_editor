import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;

filters.HexagonalPixelate = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
  type: 'HexagonalPixelate',
  
  fragmentSource:'precision highp float;\n' +
  'uniform sampler2D texture;\n' +
  'uniform vec2 center;\n' +
  'uniform float scale;\n' +
  'uniform vec2 texSize;\n' +
  'varying vec2 vTexCoord;\n' +
  'void main() {\n' +
  '    vec2 tex = (vTexCoord * texSize - center) / scale;\n' +
  '    tex.y /= 0.866025404;\n' +
  '    tex.x -= tex.y * 0.5;\n' +
  '    \n' +
  '    vec2 a;\n' +
  '    if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0) {\n' +
  '       a = vec2(floor(tex.x), floor(tex.y));\n' +
  '    }\n' +
  '    else {\n '+
  '       a = vec2(ceil(tex.x), ceil(tex.y));\n' +
  '    }\n' +
  '    vec2 b = vec2(ceil(tex.x), floor(tex.y));\n' +
  '    vec2 c = vec2(floor(tex.x), ceil(tex.y));\n' +
  '    \n' +
  '    vec3 TEX = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);\n' +
  '    vec3 A = vec3(a.x, a.y, 1.0 - a.x - a.y);\n' +
  '    vec3 B = vec3(b.x, b.y, 1.0 - b.x - b.y);\n' +
  '    vec3 C = vec3(c.x, c.y, 1.0 - c.x - c.y);\n' +
  '    \n' +
  '    float alen = length(TEX - A);\n' +
  '    float blen = length(TEX - B);\n' +
  '    float clen = length(TEX - C);\n' +
  '    \n' +
  '    vec2 choice;\n' +
  '    if (alen < blen) {\n' +
  '        if (alen < clen) {\n'+
  '            choice = a;\n' +
  '        }\n' +
  '        else {\n'+
  '            choice = c;\n' +
  '        }\n' +
  '    } else {\n' +
  '        if (blen < clen) {\n'+
  '            choice = b;\n' +
  '        }\n' +
  '        else {\n'+
  '            choice = c;\n' +
  '        }\n' +
  '    }\n' +
  '    \n' +
  '    choice.x += choice.y * 0.5;\n' +
  '    choice.y *= 0.866025404;\n' +
  '    choice *= scale / texSize;\n' +
  '    gl_FragColor = texture2D(texture, choice + center / texSize);\n' +
  '}',
  
  mainParameter: 'hexagonal_matrix',

  hexagonal_matrix : {
    center : [0, 0],
    scale : 10, // change
    width: 0,
    height : 0
  },

  applyTo2d: function(options) {
    // var imageData = options.imageData,
        // data = imageData.data, i,
        // len = data.length;
  },

  isNeutralState: function() {
    return false
  },

  getUniformLocations: function(gl, program) {
    return {
			scele : gl.getUniformLocation(program, 'scale'),
			center : gl.getUniformLocation(program, 'center'),
			texSize : gl.getUniformLocation(program, 'texSize'),
    };
  },

  sendUniformData: function(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.scale, this.hexagonal_matrix.scale);
    gl.uniform2fv(uniformLocations.center, this.hexagonal_matrix.center); 
    gl.uniform2fv(uniformLocations.texSize, [this.hexagonal_matrix.width, this.hexagonal_matrix.height]); // max size 
  },

});

fabric.Image.filters.HexagonalPixelate.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const HexagonalPixelate  = filters.HexagonalPixelate