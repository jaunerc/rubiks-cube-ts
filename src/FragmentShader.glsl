precision mediump float;

varying vec4 color;
uniform vec4 wireFrameColor;
uniform bool drawWireFrame;

void main() {
    gl_FragColor = color;
    if (drawWireFrame) {
        gl_FragColor = wireFrameColor;
    }
}
