export interface CubeBuffer {
    vertices: WebGLBuffer,
    triangles: WebGLBuffer,
    lines: WebGLBuffer,
}

export function createCubeBuffer(gl: WebGLRenderingContext): CubeBuffer {
    return {
        vertices : defineVertices(gl),
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

export function createColorBuffer(gl: WebGLRenderingContext, front: number[], right: number[], top: number[], left: number[], bottom: number[], back: number[]): WebGLBuffer {
    let colors: number[] = [];

    // front
    colorSide(colors, front);
    // right
    colorSide(colors, right);
    // top
    colorSide(colors, top);
    // left
    colorSide(colors, left);
    // bottom
    colorSide(colors, bottom);
    // back
    colorSide(colors, back);

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
