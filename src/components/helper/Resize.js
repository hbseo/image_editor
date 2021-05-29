function shapeScalingResizeEvent(canvas, pointer, obj){
  let width = Math.abs(obj.left - pointer.x);
  let height = Math.abs(obj.top - pointer.y);

  obj.set({
    width : width,
    height : height,
    scaleX : 1,
    scaleY : 1,
  })
  obj.setCoords();
  canvas.renderAll();
}

/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 */

/**
 * Get the positions of ratated origin by the pointer value
 * @param {{x: number, y: number}} origin - Origin value
 * @param {{x: number, y: number}} pointer - Pointer value
 * @param {number} angle - Rotating angle
 * @returns {Object} Postions of origin
 * @ignore
 */
function getPositionsOfRotatedOrigin(origin, pointer, angle) {
  const sx = origin.x;
  const sy = origin.y;
  const px = pointer.x;
  const py = pointer.y;
  const r = angle * Math.PI / 180;
  const rx = ((px - sx) * Math.cos(r)) - ((py - sy) * Math.sin(r)) + sx;
  const ry = ((px - sx) * Math.sin(r)) + ((py - sy) * Math.cos(r)) + sy;

  return {
      originX: (sx > rx) ? 'right' : 'left',
      originY: (sy > ry) ? 'bottom' : 'top'
  };
}

/**
 * Adjust the origin of shape by the start point
 * @param {{x: number, y: number}} pointer - Pointer value
 * @param {fabric.Object} shape - Shape object
 * @ignore
 */
function adjustOriginByStartPoint(pointer, shape) {
  const centerPoint = shape.getPointByOrigin('center', 'center');
  const angle = -shape.angle;
  const originPositions = getPositionsOfRotatedOrigin(centerPoint, pointer, angle);
  const {originX, originY} = originPositions;
  const origin = shape.getPointByOrigin(originX, originY);
  const left = shape.left - (centerPoint.x - origin.x);
  const top = shape.top - (centerPoint.y - origin.y);

  shape.set({
      originX,
      originY,
      left,
      top
  });

  shape.setCoords();
}

/**
 * Adjust the origin position of shape to center
 * @param {fabric.Object} shape - Shape object
 */
function adjustOriginToCenter  (shape) {
  const centerPoint = shape.getPointByOrigin('center', 'center');
  const {originX, originY} = shape;
  const origin = shape.getPointByOrigin(originX, originY);
  const left = shape.left + (centerPoint.x - origin.x);
  const top = shape.top + (centerPoint.y - origin.y);

  shape.set({
      hasControls: true,
      hasBorders: true,
      originX: 'center',
      originY: 'center',
      left,
      top,
  });
  shape.setCoords(); // For left, top properties
}


function adjustBackgroundImage (img) {
  // console.log(img.width)
  // const width = img.width
  // const height = img.height
  // let ratio = img.height / img.width
  // console.log(ratio)
  // const rotatedWidth = 800
  // const rotatedHeight = ratio * rotatedWidth
  // console.log(img.getBoundingRect())
  // img.set({
  //   width : rotatedWidth,
  //   height : rotatedHeight
  // })
}

function exchangeBackgroundSize(canvas, angle) {
  if(angle === 90 || angle === 270){
    // console.log(angle)
    // const originWidth = canvas.width
    // const originHeight = canvas.height
  
    // canvas.setWidth(originHeight)
    // canvas.setHeight(originWidth)
  }

}

module.exports = {
  resize(canvas, event, obj){
    const pointer = canvas.getPointer(event, false);
    adjustOriginByStartPoint(pointer, obj)
    shapeScalingResizeEvent(canvas, pointer, obj);
    adjustOriginToCenter(obj)
  },
  adjustOriginToCenter(shape){
    adjustOriginToCenter(shape)
  },
  adjustBackgroundImage(img){
    adjustBackgroundImage(img)
  },
  exchangeBackgroundSize(canvas,angle){
    exchangeBackgroundSize(canvas, angle)
  }
}
