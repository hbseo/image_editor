import Action from './Action';

class Rotation extends Action {
    constructor(App){
        super('Rotation', App);
        // console.log(this.canvas);
    }

    getCurrentAngle() {
        // console.log('active',this.getActiveObject().angle);
        if(this.getActiveObject()){
            return this.getActiveObject().angle;
        }
        else {
            return null;
        }
    }


    setAngle(angle){
        console.log(this)
        angle %= 360
        // const oldAngle = this.getCurrentAngle() % 360;
        // const angleDiff = oldAngle - angle;
        const activeImage = this.getActiveObject();
        const canvas = this.getCanvas();
        // console.log(activeImage);

        // const oldImageCenter = activeImage.getCenterPoint();
        activeImage.set({
            angle : angle,
        }).setCoords();
        // const newImageCenter = activeImage.getCenterPoint();


        // console.log(oldImageCenter, newImageCenter)
        

        
        // const centerDiff = {
        //     x: oldImageCenter.x - newImageCenter.x,
        //     y: oldImageCenter.y - newImageCenter.y
        // };
        // const objCenter = activeImage.getCenterPoint();
        // const radian = fabric.util.degreesToRadians(angleDiff);
        // const newObjCenter = fabric.util.rotatePoint(objCenter, oldImageCenter, radian);

        // activeImage.set({
        //     left: newObjCenter.x - centerDiff.x,
        //     top: newObjCenter.y - centerDiff.y,
        //     angle: (activeImage.angle + angleDiff) % 360
        // });
        // activeImage.setCoords();

        canvas.renderAll();
    }
}

export default Rotation;