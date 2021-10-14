import {mat4} from "gl-matrix";
import {loadShader, prepareWebGl} from './GlShaderLoader';
import {createColorBuffer, createCubeBuffer, CubeBuffer} from "./CubeBuffer";
import {createRubikCube, Cube, rotateLayerX, rotateLayerY, rotateLayerZ, RubikCube} from "./RubikCube";

interface ShaderContext {
    vertexPositionId: number,
    vertexColorId: number,
    projectionId: WebGLUniformLocation,
    modelId: WebGLUniformLocation,
    viewId: WebGLUniformLocation,
    wireFrameColorId: WebGLUniformLocation,
    drawWireFrameId: WebGLUniformLocation,
}

interface Scene {
    eyePosition: number[],
    wireFrameColor: number[],
    lookAtCenter: number[],
    lookAtUp: number[],
    rotation: {
        angle: number,
        rotationOnAxis: number[]
    },
    rubikCube: RubikCube,
}

let gl: WebGLRenderingContext;
let shaderProgram: WebGLProgram;
let shaderContext: ShaderContext;
let scene: Scene;

window.onload = start;

function start() {
    let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    gl = prepareWebGl(canvas);
    shaderProgram = gl.createProgram();

    gl.clearColor(0.4, 0.823, 1, 1);

    document.addEventListener("keydown", keyPressed);

    loadShader(gl, shaderProgram)
        .finally(() => {
            shaderContext = createShaderContext();
            createProjection();
            scene = createScene();
            window.requestAnimationFrame(callback);
        });
}

function callback(){
    draw();

    window.requestAnimationFrame(callback);
}

function createShaderContext(): ShaderContext {
    return {
        vertexPositionId: gl.getAttribLocation(shaderProgram, "vertexPosition"),
        vertexColorId: gl.getAttribLocation(shaderProgram, "vertexColor"),
        projectionId: gl.getUniformLocation(shaderProgram, "projection"),
        modelId: gl.getUniformLocation(shaderProgram, "model"),
        viewId: gl.getUniformLocation(shaderProgram, "view"),
        wireFrameColorId: gl.getUniformLocation(shaderProgram, "wireFrameColor"),
        drawWireFrameId: gl.getUniformLocation(shaderProgram, "drawWireFrame"),
    };
}

function createProjection() {
    let projection = mat4.create();
    let screenRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    mat4.perspective(projection, toRadian(45), screenRatio, 1, 300);
    gl.uniformMatrix4fv(shaderContext.projectionId , false , projection);
}

function toRadian(degrees: number): number {
    return (degrees * Math.PI) / 180.0;
}

function createViewMatrix() {
    let view = mat4.create();
    const eye: Readonly<[number, number, number]> = [scene.eyePosition[0], scene.eyePosition[1], scene.eyePosition[2]];
    const lookAt: Readonly<[number, number, number]> = [scene.lookAtCenter[0], scene.lookAtCenter[1], scene.lookAtCenter[2]];
    const lookAtUp: Readonly<[number, number, number]> = [scene.lookAtUp[0], scene.lookAtUp[1], scene.lookAtUp[2]];
    mat4.lookAt(view, eye, lookAt, lookAtUp);
    gl.uniformMatrix4fv(shaderContext.viewId, false, view);
}

function createScene(): Scene {
    return {
        eyePosition: [20, 20, 20],
        wireFrameColor: [0, 0, 0, 1],
        lookAtCenter: [0, 0, 0],
        lookAtUp: [0, 1, 0],
        rotation: {
            angle: 0,
            rotationOnAxis: [2, 0, 0]
        },
        rubikCube: createRubikCube(),
    };
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST); // enable depth test in 3D space along the z-axis

    createViewMatrix();

    drawCubes();
}

function drawCubes() {
    let buffer = createCubeBuffer(gl);

    scene.rubikCube.cubes.forEach((cube) => {
        drawSolid(cube, buffer);

        drawWireFrame(buffer);
    });
}

function drawSolid(cube: Cube, buffer: CubeBuffer) {
    // matrix for the cube to handle rotation, view etc.
    let modelView = mat4.create();
    mat4.translate(modelView, modelView, [cube.position[0], cube.position[1], cube.position[2]]);
    gl.uniformMatrix4fv(shaderContext.modelId, false, modelView);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertices);
    gl.vertexAttribPointer(shaderContext.vertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderContext.vertexPositionId);

    let colorBuffer = facesToBuffer(cube);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderContext.vertexColorId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderContext.vertexColorId);

    let numTriangles = 36; // 12 triangles * 3 endpoints
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.triangles);
    gl.drawElements(gl.TRIANGLES, numTriangles, gl.UNSIGNED_SHORT, 0);
}

function facesToBuffer(cube: Cube): WebGLBuffer {
    return createColorBuffer(gl,
        cube.faces.front.rgb,
        cube.faces.right.rgb,
        cube.faces.top.rgb,
        cube.faces.left.rgb,
        cube.faces.bottom.rgb,
        cube.faces.back.rgb);
}

function drawWireFrame(buffer: CubeBuffer) {
    gl.uniform1i(shaderContext.drawWireFrameId, 1);
    gl.uniform4fv(shaderContext.wireFrameColorId, scene.wireFrameColor);

    let numLines = 24; // 12 lines * 2 endpoints
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.lines);
    gl.drawElements(gl.LINES, numLines, gl.UNSIGNED_SHORT, 0);

    gl.uniform1i(shaderContext.drawWireFrameId, 0);
}

function keyPressed(e: KeyboardEvent) {
    switch (e.key) {
        case 'r':
            rotateLayerX(scene.rubikCube, 2);
            break;
        case 's':
            rotateLayerX(scene.rubikCube, 0);
            break;
        case 'l':
            rotateLayerX(scene.rubikCube, -2);
            break;
        case 't':
            rotateLayerY(scene.rubikCube, 2);
            break;
        case 'e':
            rotateLayerY(scene.rubikCube, 0);
            break;
        case 'b':
            rotateLayerY(scene.rubikCube, -2);
            break;
        case 'f':
            rotateLayerZ(scene.rubikCube, 2);
            break;
        case 'm':
            rotateLayerZ(scene.rubikCube, 0);
            break;
        case 'k':
            rotateLayerZ(scene.rubikCube, -2);
            break;
    }
}
