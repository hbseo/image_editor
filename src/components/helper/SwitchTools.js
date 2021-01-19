import { fabric } from 'fabric';
export default function SwitchTools(...args){
  for(let i = 0; i< args.length-1; i++) {
    fabric.util.toArray(document.getElementsByClassName(args[i])).forEach(el => 
      el.disabled = args[args.length-1]
    );
  }
}