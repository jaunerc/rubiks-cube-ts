
export function CubeBuffer(gl, color) {
    return {
        vertices: defineVertices(gl),
        colors: defineColors(gl, color),
        triangles: defineTriangles(gl),
    };
}

function defineVertices(gl) {
    let vertices = [
        // front
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        // right
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,

        // top
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,

        // left
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,

        // bottom
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,

        // back
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5
    ];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return buffer;
}

function defineColors(gl) {
    let colors = [
        // front
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // right
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // top
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // left
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        // bottom
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,

        // back
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, 1,
    ];

    /*for (let i = 0; i < 24; i++) {
        colors.push(color.r, color.g, color.b);
    }*/

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return buffer;
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