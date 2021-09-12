
export function prepareWebGl(canvas) {
    let context = canvas.getContext('webgl')
    if (!context) {
        alert("Your Browser does not support WebGL :-(");
    }
    return context;
}

export async function loadShader(gl, shaderProgram) {
    const fragmentUrl = './FragmentShader.glsl';
    const vertexUrl = './VertexShader.glsl';
    const fragmentSource = await fetch(fragmentUrl)
        .then(function (response) {
            return response.text();
        });
    const vertexSource = await fetch(vertexUrl)
        .then(function (response) {
            return response.text();
        });

    let vertexShader = createAndCompileShader(gl, gl.VERTEX_SHADER, vertexSource);
    let fragmentShader = createAndCompileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shader");
        return false;
    }
    gl.useProgram(shaderProgram);
    console.log("webgl is ready");
}

function createAndCompileShader(gl, shaderType, shaderSource) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Shader Compile Error: " + gl.getShaderInfoLog(shader));
        return false;
    }
    return shader;
}
