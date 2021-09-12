attribute vec3 vertexPosition;
attribute vec3 vertexColor;

uniform mat4 projection;
uniform mat4 model;

varying vec4 color;

void main() {
    color = vec4(vertexColor, 1);

    gl_Position = projection * model * vec4(vertexPosition, 1);
}
