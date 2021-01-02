import Action from './Action';
class Flip extends Action {
    constructor(App) {
        super('Flip', App);
    }

    flip = (image, option) => {
        const canvas = this.getCanvas();
        switch (option) {
            case 'X':
                image.set({ flipX: !image.flipX });
                break;
            case 'Y':
                image.set({ flipY: !image.flipY });
                break;
            default:
        }
        canvas.renderAll();
    }
}
export default Flip;