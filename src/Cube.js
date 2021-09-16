import {mat4} from "gl-matrix";
import {toRadian} from "gl-matrix/cjs/common";

export class Cube{
    constructor(
        initialX,
        initialY,
        initialZ,
    ) {
        this.currentPositionX = initialX;
        this.currentPositionY = initialY;
        this.currentPositionZ = initialZ;

        this.nextPositionX = initialX;
        this.nextPositionY = initialY;
        this.nextPositionZ = initialZ;

        this.currentAngleX = 0;
        this.currentAngleY = 0;
        this.currentAngleZ = 0;

        this.nextAngleX = 0;
        this.nextAngleY = 0;
        this.nextAngleZ = 0;

        this.ready = true;
    }

    positionsAndAngelsAreSame(){
        return this.currentPositionX === this.nextPositionX &&
            this.currentPositionY === this.nextPositionY &&
            this.currentPositionZ === this.nextPositionZ
            &&
            this.currentAngleX === this.nextAngleX &&
            this.currentAngleY === this.nextAngleY &&
            this.currentAngleZ === this.nextAngleZ
            &&
            this.ready;
    }

    applyRotation(rotMat, angle){
        let x = this.currentPositionX;
        let y = this.currentPositionY;
        let z = this.currentPositionZ;

        this.nextPositionX = x * rotMat[0] + y * rotMat[1] + z * rotMat[2];
        this.nextPositionY = x * rotMat[3] + y * rotMat[4] + z * rotMat[5];
        this.nextPositionZ = x * rotMat[6] + y * rotMat[7] + z * rotMat[8];

        this.nextAngleX = calculateNextAngle(this.currentAngleX, angle[0]);
        this.nextAngleY = calculateNextAngle(this.currentAngleY, angle[1]);
        this.nextAngleZ = calculateNextAngle(this.currentAngleZ, angle[2]);

        this.ready = false;
    }

    getModelView(view){
        let modelView = mat4.create();

        mat4.rotate(modelView, modelView, toRadian(this.currentAngleX), [1, 0, 0]);
        mat4.rotate(modelView, modelView, toRadian(this.currentAngleY), [0, 1, 0]);
        mat4.rotate(modelView, modelView, toRadian(this.currentAngleZ), [0, 0, 1]);

        mat4.translate(modelView, modelView, [this.currentPositionX, this.currentPositionY, this.currentPositionZ]);

        return modelView;
    }

    calculateCurrent(){
        if(this.positionsAndAngelsAreSame()){
            return;
        }

        if(
            this.currentAngleX === this.nextAngleX &&
            this.currentAngleY === this.nextAngleY &&
            this.currentAngleZ === this.nextAngleZ
        ){
            this.currentAngleX = limitAngleTo360(this.currentAngleX);
            this.currentAngleY = limitAngleTo360(this.currentAngleY);
            this.currentAngleZ = limitAngleTo360(this.currentAngleZ);

            this.nextAngleX = limitAngleTo360(this.nextAngleX);
            this.nextAngleY = limitAngleTo360(this.nextAngleY);
            this.nextAngleZ = limitAngleTo360(this.nextAngleZ);

            this.currentPositionX = this.nextPositionX;
            this.currentPositionY = this.nextPositionY;
            this.currentPositionZ = this.nextPositionZ;

            this.ready = true;

            return;
        }

        this.currentAngleX = calculateCurrentAngle(this.currentAngleX, this.nextAngleX);
        this.currentAngleY = calculateCurrentAngle(this.currentAngleY, this.nextAngleY);
        this.currentAngleZ = calculateCurrentAngle(this.currentAngleZ, this.nextAngleZ);
    }
}

function calculateNextAngle(current, nextStep){
    return current + nextStep;
}

function limitAngleTo360(angel){
    if(angel >= 360){
        return angel - 360;
    }

    if(angel < 0){
        return  angel + 360
    }

    return angel;
}

function calculateCurrentAngle(current, next){
    if(current === next){
        return current;
    }

    if(current < next){
        return current + 1;
    }

    if(current > next){
        return current - 1;
    }
}