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
let sliderZ = document.getElementById("rangeZ");
let zoom = document.getElementById("zoom");
let xAngle = 20;
let yAngle = 0;
let zAngle = 0;

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
    xAngle = Math.cos(toRadian(this.value)) * 20;
    zAngle = Math.sin(toRadian(this.value)) * 20;
    scene.eyePosition = [xAngle, yAngle, zAngle];
}

sliderY.oninput = function() {
    console.log('valy:', this.value);
    yAngle = (parseInt(this.value)* Math.PI / 180);
    scene.eyePosition = [xAngle, yAngle, zAngle];
}

sliderZ.oninput = function() {
    zAngle = (parseInt(this.value) *Math.PI / 180);
    scene.eyePosition = [xAngle, yAngle, zAngle];
    draw();
}

zoom.oninput = function() {
    console.log('zoom:', this.value);
    xAngle = yAngle = zAngle = this.value;
    scene.eyePosition = [this.value, this.value, this.value];
    draw();
}


function callback(){
    scene.rotation.angle += 1;

    draw();

    window.requestAnimationFrame(callback);
}

function initGlVariables() {
    const program = context.shaderProgram;
    context.vertexPositionId = gl.getAttribLocation(program, "vertexPosition");
    context.vertexColorId = gl.getAttribLocation(program, "vertexColor");

    context.projectionId = gl.getUniformLocation(program, "projection");
    context.modelId = gl.getUniformLocation(program, "model");

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

    drawCubes(view);
}

function drawCubes(view) {
    let buffer = CubeBuffer(gl);
    scene.cubes.forEach((cube) => {
        drawSolid(view, cube, buffer);

        drawWireFrame(buffer);
    });
}

function drawSolid(view, cube, buffer) {
    // matrix for the cube to handle rotation, view etc.
    let modelView = mat4.create();

    if(cube.positionX == 2){
        let angleRadian = toRadian(scene.rotation.angle);
        mat4.rotate(modelView, view, angleRadian, [1, 0, 0]);
        mat4.translate(modelView, modelView, [cube.positionX, cube.positionY, cube.positionZ]);
    }
    else {
        mat4.translate(modelView, view, [cube.positionX, cube.positionY, cube.positionZ]);
    }

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
