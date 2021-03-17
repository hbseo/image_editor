export default class Extension {
  constructor(name, App) {
    this.app = App;
    this._name = name;
  }

  getName() {
    return this._name;
  }

  getActiveObject() {
    return this.app.getActiveObject();
  }

  getCanvas() {
    return this.app.getCanvas();
  }

  getImageEditor() {
    return this.app.getImageEditor();
  }

  getGrid() {
    return this.app.getGrid();
  }

  setGrid(grid) {
    return this.app.setGrid(grid);
  }

  saveState(action) {
    return this.app.saveState(action);
  }
}
  
  
  
  