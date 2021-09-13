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
    eyePosition: [0, 0, 5],
    lookAtCenter: [0, 0, 0],
    lookAtUp: [0, 1, 0],
    rotation: {
        angle: 0,
        rotationOnAxis: [1, 1, 0]
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

    scene.cubes.push(CubeBuffer(gl, [1, 1, 0]));
    scene.cubes.push(CubeBuffer(gl, [1, -1, 0]));
    scene.cubes.push(CubeBuffer(gl, [-1, 1, 0]));
    scene.cubes.push(CubeBuffer(gl, [-1, -1, 0]));
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST); // enable depth test in 3D space along the z-axis

    let view = createViewMatrix();

    drawCubes(view);
}

function drawCubes(view) {
    scene.cubes.forEach((buffer) => {
        // matrix for the cube to handle rotation, view etc.
        let modelView = mat4.create();
        mat4.translate(modelView, view, buffer.position);
        mat4.rotate(modelView, modelView, toRadian(scene.rotation.angle), scene.rotation.rotationOnAxis);
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
    });
}
