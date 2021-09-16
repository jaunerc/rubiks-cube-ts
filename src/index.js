import {mat4} from "gl-matrix";
import {loadShader, prepareWebGl} from './glUtil.js';
import {CubeBuffer} from "./CubeBuffer";
import {toRadian} from "gl-matrix/cjs/common";
import {Cube} from "./Cube";

let gl;

let context = {
    shaderProgram: null
};

let sliderX = document.getElementById("rangeX");
let sliderY = document.getElementById("rangeY");
let zoom = document.getElementById("zoom");
let xAngle = 20;
let yAngle = 0;
let zAngle = 0;

let step = 0;

let positiveXRotation = {
    rotationMatrix: [
        1, 0, 0,
        0, 0, -1,
        0, 1, 0
    ],
    angle: [90, 0, 0]
}
let negativeXRotation = {
    rotationMatrix: [
        1, 0, 0,
        0, 0, 1,
        0, -1, 0
    ],
    angle: [-90, 0, 0]
}

let positiveYRotation = {
    rotationMatrix: [
        0, 0, 1,
        0, 1, 0,
        -1, 0, 0
    ],
    angle: [0, 90, 0]
}
let negativeYRotation = {
    rotationMatrix: [
        0, 0, -1,
        0, 1, 0,
        1, 0, 0
    ],
    angle: [0, -90, 0]
}

let positiveZRotation = {
    rotationMatrix: [
        0, -1, 0,
        1, 0, 0,
        0, 0, 1
    ],
    angle: [0, 0, 90]
}
let negativeZRotation = {
    rotationMatrix: [
        0, 1, 0,
        -1, 0, 0,
        0, 0, 1
    ],
    angle: [0, 0, -90]
}

let scene = {
    clearColor: {r:0.4, g:0.823, b:1, a:1},
    eyePosition: [xAngle, yAngle, zAngle],
    wireFrameColor: [0, 0, 0, 1],
    lookAtCenter: [0, 0, 0],
    lookAtUp: [0, 1, 0],
    rotation: {
        angle: 0,
        rotationOnAxis: [2, 0, 0]
    },
    cubes: [],
};

window.onload = start;

function start() {
    let canvas = document.getElementById('myCanvas');
    gl = prepareWebGl(canvas);
    context.shaderProgram = gl.createProgram();

    let color = scene.clearColor;
    gl.clearColor(color.r, color.g, color.b, color.a);

    loadShader(gl, context.shaderProgram)
        .finally(() => {
            initGlVariables();
            createScene();
            window.requestAnimationFrame(callback);
        });
}

sliderX.oninput = function() {
    scene.lookAtUp = [0, 1, 0];
    xAngle = Math.cos(toRadian(this.value)) * 20;
    zAngle = Math.sin(toRadian(this.value)) * 20;
    scene.eyePosition = [xAngle, yAngle, zAngle];
}

sliderY.oninput = function() {
    yAngle = Math.sin(toRadian(this.value)) * 20;
    xAngle = Math.cos(toRadian(this.value)) * 20;
    if(this.value <= 90){
        scene.lookAtUp = [0, 1, 0];
    } else if(this.value > 90 && this.value <= 180){
        scene.lookAtUp =  [0, -1, 0];
    } else {
        scene.lookAtUp = [1, 0, 0];
    }
    console.log(this.value, 'x:', xAngle, 'y:', yAngle);
    scene.eyePosition = [xAngle, yAngle, zAngle];
}

zoom.oninput = function() {
    console.log('zoom:', this.value);
    xAngle = yAngle = zAngle = this.value;
    scene.eyePosition = [this.value, this.value, this.value];
}


function callback(){
    let ready = scene.cubes.filter(c => c.ready);

    if(scene.cubes.length === ready.length) {
        stepper();
    }

    draw();

    window.requestAnimationFrame(callback);
}

function stepper(){
    let rotationInfo;
    let face;

    switch (step){
        case 1:
            rotationInfo = positiveXRotation;
            face = filterCubesX(0);
            break
        case 2:
            rotationInfo = negativeXRotation;
            face = filterCubesX(0);
            break
        case 3:
            rotationInfo = positiveYRotation;
            face = filterCubesY(2);
            break
        case 4:
            rotationInfo = negativeYRotation;
            face = filterCubesY(2);
            break
        case 5:
            rotationInfo = positiveZRotation;
            face = filterCubesZ(-2);
            break
        case 6:
            rotationInfo = negativeZRotation;
            face = filterCubesZ(-2);
            break
        default:
            step = 1;
            return;
    }

    step++;

    rotateCubes(face, rotationInfo);
}

function filterCubesX(number){
    return scene.cubes.filter(c => c.currentPositionX === number);
}

function filterCubesY(number){
    return scene.cubes.filter(c => c.currentPositionY === number);
}

function filterCubesZ(number){
    return scene.cubes.filter(c => c.currentPositionZ === number);
}

function rotateCubes(cubes, rotationInfo){
    cubes.forEach(c => c.applyRotation(rotationInfo.rotationMatrix, rotationInfo.angle));
}

function initGlVariables() {
    const program = context.shaderProgram;
    context.vertexPositionId = gl.getAttribLocation(program, "vertexPosition");
    context.vertexColorId = gl.getAttribLocation(program, "vertexColor");

    context.projectionId = gl.getUniformLocation(program, "projection");
    context.modelId = gl.getUniformLocation(program, "model");
    context.viewId = gl.getUniformLocation(program, "view");

    context.wireFrameColorId = gl.getUniformLocation(program, "wireFrameColor");
    context.drawWireFrameId = gl.getUniformLocation(program, "drawWireFrame");
}

function createProjection() {
    let projection = mat4.create();
    let screenRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    mat4.perspective(projection, toRadian(45), screenRatio, 1, 300);
    gl.uniformMatrix4fv(context.projectionId , false , projection);
}

function createViewMatrix() {
    let view = mat4.create();
    mat4.lookAt(view, scene.eyePosition, scene.lookAtCenter, scene.lookAtUp);
    return view;
}

function createScene() {
    createProjection();

    for(let x = -2; x <= 2; x +=2){
        for(let y = -2; y <= 2; y +=2){
            for(let z = -2; z <= 2; z +=2){
                scene.cubes.push(new Cube(x, y, z));
            }
        }
    }
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST); // enable depth test in 3D space along the z-axis

    let view = createViewMatrix();
    gl.uniformMatrix4fv(context.viewId, false, view);

    drawCubes(view);
}

function drawCubes(view) {
    let buffer = CubeBuffer(gl);

    scene.cubes.forEach(c => c.calculateCurrent());
    scene.cubes.forEach((cube) => {
        drawSolid(view, cube, buffer);

        drawWireFrame(buffer);
    });
}

function drawSolid(view, cube, buffer) {

    // matrix for the cube to handle rotation, view etc.
    let modelView = cube.getModelView(view);
    gl.uniformMatrix4fv(context.modelId, false, modelView);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertices);
    gl.vertexAttribPointer(context.vertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.vertexPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.colors);
    gl.vertexAttribPointer(context.vertexColorId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.vertexColorId);

    let numTriangles = 36; // 12 triangles * 3 endpoints
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.triangles);
    gl.drawElements(gl.TRIANGLES, numTriangles, gl.UNSIGNED_SHORT, 0);
}

function drawWireFrame(buffer) {
    gl.uniform1i(context.drawWireFrameId, 1);
    gl.uniform4fv(context.wireFrameColorId, scene.wireFrameColor);

    let numLines = 24; // 12 lines * 2 endpoints
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.lines);
    gl.drawElements(gl.LINES, numLines, gl.UNSIGNED_SHORT, 0);

    gl.uniform1i(context.drawWireFrameId, 0);
}
