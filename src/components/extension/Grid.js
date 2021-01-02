import Extension from './Extension';
import { fabric } from 'fabric';
class Grid extends Extension {
    constructor(App) {
      super('Grid', App);
    }

    makeGrid = () => {
			let grid;
			let canvas = this.getCanvas();

      if(this.getGrid()) { return; }
  
      let grids = [];
      let gridoption = {
        stroke: "#000000",
        strokeWidth: 1,
        // strokeDashArray: [5, 5]
      };
      for (let x = 0; x < (canvas.width); x += 10) {
        grids.push(new fabric.Line([x, 0, x, canvas.height], gridoption)); // vertical
      }
      for (let y = 0; y < (canvas.height); y += 10) {
        grids.push(new fabric.Line([0, y, canvas.width, y], gridoption)); // horizon
      }
      grid = new fabric.Group(grids, {
        selectable : false,
        evented : false
      })
			grid.addWithUpdate();
			
			this.setGrid(grid);
			
      // for (var i = 0; i < (1000 / 10); i++) {
      //   this._canvas.add(new fabric.Line([ i * 10, 0, i * 10, 1000], { stroke: '#000000', selectable: false, evented: false })); // vertical
      //   this._canvas.add(new fabric.Line([ 0, i * 10, 1000, i * 10], { stroke: '#000000', selectable: false, evented: false })); // horizon
      // }
		}
		
		showGrid = () => {
			const canvas = this.getCanvas();
			const grid = this.getGrid();
			canvas.add(grid);
			canvas.sendToBack(grid);
			canvas.renderAll();
		}

		hideGrid = () => {
			const canvas = this.getCanvas();
			const grid = this.getGrid();
			canvas.remove(grid);
			canvas.renderAll();
		}

}
  
  export default Grid;