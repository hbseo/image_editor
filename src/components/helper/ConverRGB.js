/**
 * return RGBA string
 * @param  {Object} color
 * @return {String} rgba
 * color : { r : number, g : number, b : number, a : number } 
 */
export default function converRGB(color){
    return `rgba(${color.r }, ${ color.g }, ${ color.b }, ${ color.a })`;
}