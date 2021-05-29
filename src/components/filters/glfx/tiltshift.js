import { fabric } from 'fabric';
var filters = fabric.Image.filters
var createClass = fabric.util.createClass;

filters.TiltShift = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.MyFilter.prototype */ {
  type: 'TiltShift',
  
  fragmentSource:'precision highp float;\n' +
    'uniform sampler2D texture;\n' +
    'uniform float blurRadius;\n' +
    'uniform float gradientRadius;\n' +
    'uniform vec2 start;\n' +
    'uniform vec2 end;\n' +
    'uniform vec2 delta;\n' +
    'uniform vec2 texSize;\n' +
    'varying vec2 vTexCoord;\n' +
    'float random(vec3 scale, float seed) {\n' +
    '  /* use the fragment position for a different seed per-pixel */\n' +
    '  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n' +
    '}\n' +
    'void main() {\n' +
    '    vec4 color = vec4(0.0);\n' +
    '    float total = 0.0;\n' +
    '    \n' +
    '    /* randomize the lookup values to hide the fixed number of samples */\n' +
    '    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n' +
    '    \n' +
    '    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n' +
    '    float radius = smoothstep(0.0, 1.0, abs(dot(vTexCoord * texSize - start, normal)) / gradientRadius) * blurRadius;\n' +
    '    for (float t = -30.0; t <= 30.0; t++) {\n' +
    '        float percent = (t + offset - 0.5) / 30.0;\n' +
    '        float weight = 1.0 - abs(percent);\n' +
    '        vec4 sample = texture2D(texture, vTexCoord + delta / texSize * percent * radius);\n' +
    '        \n' +
    '        /* switch to pre-multiplied alpha to correctly blur transparent images */\n' +
    '        sample.rgb *= sample.a;\n' +
    '        \n' +
    '        color += sample * weight;\n' +
    '        total += weight;\n' +
    '    }\n' +
    '    \n' +
    '    gl_FragColor = color / total;\n' +
    '    \n' +
    '    /* switch back from pre-multiplied alpha */\n'+
    '    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n'+
  '}',
  
  mainParameter: 'tiltshift_matrix',

  tiltshift_matrix : {
    blurRadius: 0,
    gradientRadius: 0,
    start: [0, 0],
    end: [0, 0],
    delta: [0, 0],
    texSize: [0, 0]
  },

  retrieveShader: function(options) {
    if (!options.programCache.hasOwnProperty(this.type)) {
      options.programCache[this.type] = this.createProgram(options.context);
    }
    return options.programCache[this.type];
  },

  applyTo2d: function(options) {
    // var imageData = options.imageData,
    //     data = imageData.data, i,
    //     len = data.length;
  },

  applyToWebGL: function(options){
    var gl = options.context;
    var shader = this.retrieveShader(options);
    
    if (options.pass === 0 && options.originalTexture) {
      gl.bindTexture(gl.TEXTURE_2D, options.originalTexture);
    }
    else {
      gl.bindTexture(gl.TEXTURE_2D, options.sourceTexture);
    }

    for(var i = 0 ; i < 2; i ++ ){
      gl.useProgram(shader.program);
      console.log(gl, [i*this.tiltshift_matrix.delta[0], this.tiltshift_matrix.delta[1]])

      this.sendAttributeData(gl, shader.attributeLocations, options.aPosition);
  
      gl.uniform1f(shader.uniformLocations.blurRadius, this.tiltshift_matrix.blurRadius);
      gl.uniform1f(shader.uniformLocations.gradientRadius, this.tiltshift_matrix.gradientRadius);
      if(i === 0){
        gl.uniform2fv(shader.uniformLocations.delta, this.tiltshift_matrix.delta); 
      }
      else{
        gl.uniform2fv(shader.uniformLocations.delta, [-this.tiltshift_matrix.delta[1], this.tiltshift_matrix.delta[0]]);
      }

      gl.uniform2fv(shader.uniformLocations.start, this.tiltshift_matrix.start); 
      gl.uniform2fv(shader.uniformLocations.end, this.tiltshift_matrix.end); 
      gl.uniform2fv(shader.uniformLocations.texSize, this.tiltshift_matrix.texSize); // max size 
  
      this.sendUniformData(gl, shader.uniformLocations);
      gl.viewport(0, 0, options.destinationWidth, options.destinationHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  isNeutralState: function() {
    return false
  },

  // getUniformLocations: function(gl, program) {
  //   return {
  //       blurRadius : gl.getUniformLocation(program, 'blurRadius'),
  //       gradientRadius : gl.getUniformLocation(program, 'gradientRadius'),
  //       start : gl.getUniformLocation(program, 'start'),
  //       end : gl.getUniformLocation(program, 'end'),
  //       delta : gl.getUniformLocation(program, 'delta'),
	// 	    texSize : gl.getUniformLocation(program, 'texSize'),
  //   };
  // },

  // sendUniformData: function(gl, uniformLocations) {
  //   gl.uniform1f(uniformLocations.blurRadius, this.tiltshift_matrix.blurRadius);
  //   gl.uniform1f(uniformLocations.gradientRadius, this.tiltshift_matrix.gradientRadius);
  //   gl.uniform2fv(uniformLocations.delta, this.tiltshift_matrix.delta); 
  //   gl.uniform2fv(uniformLocations.start, this.tiltshift_matrix.start); 
  //   gl.uniform2fv(uniformLocations.end, this.tiltshift_matrix.end); 
  //   gl.uniform2fv(uniformLocations.texSize, this.tiltshift_matrix.texSize); // max size 
  // },

});
fabric.Image.filters.TiltShift.fromObject = fabric.Image.filters.BaseFilter.fromObject;
export const TiltShift  = filters.TiltShift