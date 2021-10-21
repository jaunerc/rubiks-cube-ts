import {
    multiply,
    ROTATION_X_AXIS_NINETY_DEGREES_CLOCKWISE, ROTATION_X_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE,
    ROTATION_Y_AXIS_NINETY_DEGREES_CLOCKWISE, ROTATION_Y_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE,
    ROTATION_Z_AXIS_NINETY_DEGREES_CLOCKWISE, ROTATION_Z_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE
} from "./Matrix";

export interface Cube {
    position: [number, number, number],
    faces: Faces,
}

export interface FaceColor {
    rgb: [number, number, number],
}

const RED: FaceColor = {rgb: [1, 0, 0]};
const GREEN: FaceColor = {rgb: [0, 1, 0]};
const BLUE: FaceColor = {rgb: [0, 0, 1]};
const YELLOW: FaceColor = {rgb: [1, 1, 0]};
const WHITE: FaceColor = {rgb: [1, 1, 1]};
const ORANGE: FaceColor = {rgb: [1, 0.6, 0]};

export interface Faces {
    front: FaceColor,
    right: FaceColor,
    top: FaceColor,
    left: FaceColor,
    bottom: FaceColor,
    back: FaceColor,
}

export interface RubikCube {
    cubes: Cube[],
}

export function createRubikCube(): RubikCube {
    const positionOffset = 2;
    const cubes: Cube[] = [];
    for (let x = -positionOffset; x <= positionOffset; x += positionOffset) {
        for (let y = -positionOffset; y <= positionOffset; y += positionOffset) {
            for (let z = -positionOffset; z <= positionOffset; z += positionOffset) {
                cubes.push({
                    position: [x, y, z],
                    faces: {
                        front: RED,
                        right: BLUE,
                        top: WHITE,
                        left: YELLOW,
                        bottom: GREEN,
                        back: ORANGE
                    },
                });
            }
        }
    }
    return {cubes};
}

export function rotateLayerXClockwise(rubik: RubikCube, layerIndex: number): void {
    rubik.cubes
        .filter(cube => cube.position[0] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(ROTATION_X_AXIS_NINETY_DEGREES_CLOCKWISE, cube.position);
            cube.faces = {
                ...cube.faces,
                front: cube.faces.bottom,
                top: cube.faces.front,
                back: cube.faces.top,
                bottom: cube.faces.back,
            };
        });
}

export function rotateLayerXCounterclockwise(rubik: RubikCube, layerIndex: number): void {
    rubik.cubes
        .filter(cube => cube.position[0] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(ROTATION_X_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE, cube.position);
            cube.faces = {
                ...cube.faces,
                front: cube.faces.top,
                top: cube.faces.back,
                back: cube.faces.bottom,
                bottom: cube.faces.front,
            };
        });
}

export function rotateLayerYClockwise(rubik: RubikCube, layerIndex: number): void {
    rubik.cubes
        .filter(cube => cube.position[1] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(ROTATION_Y_AXIS_NINETY_DEGREES_CLOCKWISE, cube.position);
            cube.faces = {
                ...cube.faces,
                front: cube.faces.right,
                right: cube.faces.back,
                back: cube.faces.left,
                left: cube.faces.front,
            };
        });
}

export function rotateLayerYCounterclockwise(rubik: RubikCube, layerIndex: number): void {
    rubik.cubes
        .filter(cube => cube.position[1] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(ROTATION_Y_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE, cube.position);
            cube.faces = {
                ...cube.faces,
                front: cube.faces.left,
                right: cube.faces.front,
                back: cube.faces.right,
                left: cube.faces.back,
            };
        });
}

export function rotateLayerZClockwise(rubik: RubikCube, layerIndex: number): void {
    rubik.cubes
        .filter(cube => cube.position[2] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(ROTATION_Z_AXIS_NINETY_DEGREES_CLOCKWISE, cube.position);
            cube.faces = {
                ...cube.faces,
                top: cube.faces.left,
                left: cube.faces.bottom,
                bottom: cube.faces.right,
                right: cube.faces.top,
            };
        });
}

export function rotateLayerZCounterclockwise(rubik: RubikCube, layerIndex: number): void {
    rubik.cubes
        .filter(cube => cube.position[2] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(ROTATION_Z_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE, cube.position);
            cube.faces = {
                ...cube.faces,
                top: cube.faces.right,
                left: cube.faces.top,
                bottom: cube.faces.left,
                right: cube.faces.bottom,
            };
        });
}
