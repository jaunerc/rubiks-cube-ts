
export function CubeBuffer(gl, position) {
    return {
        vertices: defineVertices(gl),
        colors: defineColors(gl),
        triangles: defineTriangles(gl),
        position: position
    };
}

function defineVertices(gl) {
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

const RED = [1,0,0];
const GREEN = [0,1,0];
const BLUE = [0,0,1];
const PINK = [1,0,1];
const TURQUOISE = [0,1,1];
const WHITE = [1,1,1];
const BLACK = [0,0,0];

function defineColors(gl) {
    let colors = [];

    // front
    colorSide(colors, RED);
    // right
    colorSide(colors, GREEN);
    // top
    colorSide(colors, BLUE);
    // left
    colorSide(colors, PINK);
    // bottom
    colorSide(colors, TURQUOISE);
    // back
    colorSide(colors, WHITE);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.flat()), gl.STATIC_DRAW);
    return buffer;
}

function colorSide(colors, color){
    for (let i = 0; i < 4; i++){
        colors.push(color);
    }
}

function defineTriangles(gl) {
    let triangles = [
        // front
        0, 1, 2,        2, 3, 0,
        // right
        4, 5, 6,        6, 7, 4,
        // top
        8, 9, 10,       10, 11, 8,
        // left
        12, 13, 14,     14, 15, 12,
        // bottom
        16, 17, 18,     18, 19, 16,
        // back
        20, 21, 22,     22, 23, 20
    ];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
    return buffer;
}