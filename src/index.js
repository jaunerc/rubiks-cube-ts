import {mat4} from "gl-matrix";
import {loadShader, prepareWebGl} from './glUtil.js';
import {CubeBuffer} from "./CubeBuffer";
import {toRadian} from "gl-matrix/cjs/common";

let gl;

let context = {
    shaderProgram: null
};

let scene = {
    clearColor: {r:0.4, g:0.823, b:1, a:1},
    rectangleColor: {r:1.0, g:1.0, b:1.0},
    eyePosition: [0, 0, 5],
    lookAtCenter: [0, 0, 0],
    lookAtUp: [0, 1, 0],
    rotation: {
        angle: 120,
        rotationOnAxis: [1, 1, 0]
    },
    rectangleBuffer: null
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
            initBuffer();
            createScene();
            draw();
        });
}

function initGlVariables() {
    const program = context.shaderProgram;
    context.vertexPositionId = gl.getAttribLocation(program, "vertexPosition");
    context.vertexColorId = gl.getAttribLocation(program, "vertexColor");

    context.projectionId = gl.getUniformLocation(program, "projection");
    context.modelId = gl.getUniformLocation(program, "model");
}

function initBuffer() {
    scene.rectangleBuffer = CubeBuffer(gl, scene.rectangleColor);
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
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST); // z-buffer

    let view = createViewMatrix();
    let modelView = mat4.create();
    mat4.rotate(modelView, view, toRadian(scene.rotation.angle), scene.rotation.rotationOnAxis);
    gl.uniformMatrix4fv(context.modelId, false, modelView);

    let buffer = scene.rectangleBuffer;
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
