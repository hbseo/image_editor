import Action from './Action';

import { fabric } from 'fabric';

class Coloring extends Action {
    constructor(App) {
        super('Coloring', App);
    }

    changeColor = (obj, option) => {
        let canvas = this.getCanvas();
        if (!obj.hasOwnProperty('_objects')) {
            switch (option) {
                case 'red':
                    obj.set({ fill: 'red' });
                    break;
                case 'yellow':
                    obj.set({ fill: 'yellow' });
                    break;
                case 'green':
                    obj.set({ fill: 'green' });
                    break;
                case 'black':
                    obj.set({ fill: 'black' });
                    break;
                default:
            }
        }
        canvas.renderAll();
    }


}

export default Coloring;

