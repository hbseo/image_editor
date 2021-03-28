import Action from './Action';
class Flip extends Action {
  constructor(App) {
    super('Flip', App);
  }
  flip = (option) => {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(!obj){ obj = this.getBackgroundImage(); }
    
    if(obj){
      switch (option) {
        case 'X':
          obj.set({ flipX: !obj.flipX });
          break;
        case 'Y':
          obj.set({ flipY: !obj.flipY });
          break;
        default:
      }
      this.saveState('flip');
      canvas.renderAll();
    }
  }
}
export default Flip;