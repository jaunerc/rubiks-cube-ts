export interface CubeBuffer {
    vertices: WebGLBuffer,
    colors: WebGLBuffer,
    triangles: WebGLBuffer,
    lines: WebGLBuffer,
}

export function createCubeBuffer(gl: WebGLRenderingContext): CubeBuffer {
    return {
        vertices : defineVertices(gl),
        colors : defineColors(gl),
        triangles : defineTriangles(gl),
        lines : defineLines(gl),
    }
}

function defineVertices(gl: WebGLRenderingContext): WebGLBuffer {
    let vertices = [
        // front
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,

        // right
        1, 1, 1,
        1, -1, 1,
        1, -1, -1,
        1, 1, -1,

        // top
        -1, 1, 1,
        1, 1, 1,
        1, 1, -1,
        -1, 1, -1,

        // left
        -1, 1, 1,
        -1, -1, 1,
        -1, -1, -1,
        -1, 1, -1,

        // bottom
        -1, -1, 1,
        1, -1, 1,
        1, -1, -1,
        -1, -1, -1,

        // back
        -1, 1, -1,
        -1, -1, -1,
        1, -1, -1,
        1, 1, -1
    ];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return buffer;
}

const RED = [1, 0, 0];
const GREEN = [0, 1, 0];
const BLUE = [0, 0, 1];
const YELLOW = [1, 1, 0];
const WHITE = [1, 1, 1];
const ORANGE = [1, 0.6, 0];
const BLACK = [0, 0, 0];

function defineColors(gl: WebGLRenderingContext): WebGLBuffer {
    let colors: number[] = [];

    // front
    colorSide(colors, RED);
    // right
    colorSide(colors, BLUE);
    // top
    colorSide(colors, WHITE);
    // left
    colorSide(colors, GREEN);
    // bottom
    colorSide(colors, YELLOW);
    // back
    colorSide(colors, ORANGE);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat()), gl.STATIC_DRAW);
    return buffer;
}

function colorSide(colors: number[], color: number[]) {
    for (let i = 0; i < 4; i++) {
        colors.push(color[0], color[1], color[2]);
    }
}

function defineTriangles(gl: WebGLRenderingContext): WebGLBuffer {
    let triangles = [
        // front
        0, 1, 2, 2, 3, 0,
        // right
        4, 5, 6, 6, 7, 4,
        // top
        8, 9, 10, 10, 11, 8,
        // left
        12, 13, 14, 14, 15, 12,
        // bottom
        16, 17, 18, 18, 19, 16,
        // back
        20, 21, 22, 22, 23, 20
    ];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
    return buffer;
}

function defineLines(gl: WebGLRenderingContext): WebGLBuffer {
    let lines = [
        // front
        0, 1,
        1, 2,
        2, 3,
        3, 0,

        // back
        20, 21,
        21, 22,
        22, 23,
        23, 20,

        // front to back
        0, 20,
        1, 21,
        2, 22,
        3, 23,
    ];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), gl.STATIC_DRAW);
    return buffer;
}
