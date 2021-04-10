/**
 * return RGBA string
 * @param  {Object} color
 * @return {String} rgba
 * color : { r : number, g : number, b : number, a : number } 
 */
export function convertRGB(color){
    return `rgba(${color.r }, ${ color.g }, ${ color.b }, ${ color.a })`;
}

/**
 * convert HEX color to RGB color
 * @param  {String} hexcolor
 * @return {Object} rgba
 * color : { r : number, g : number, b : number, a : number } 
 */
export function HEXtoRGB(hexcolor){
    let red = parseInt(hexcolor.substring(1,3), 16);
    let green = parseInt(hexcolor.substring(3,5), 16);
    let blue = parseInt(hexcolor.substring(5,7), 16);
    return {r : red, g : green, b : blue, a : 1};
}

export function HEXtoRGBA(hexcolor, opacity){
    let red = parseInt(hexcolor.substring(1,3), 16);
    let green = parseInt(hexcolor.substring(3,5), 16);
    let blue = parseInt(hexcolor.substring(5,7), 16);
    return {r : red, g : green, b : blue, a : opacity};
}

export function RGBtoHEX(rgbcolor){
    let hex = (rgbcolor.r).toString(16) + (rgbcolor.g).toString(16) + (rgbcolor.a).toString(16)
    return hex;
}
