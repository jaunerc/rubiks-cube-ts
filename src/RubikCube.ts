export interface Cube {
    position: [number, number, number],
    faces: Faces,
}

const RED: [number, number, number] = [1, 0, 0];
const GREEN: [number, number, number] = [0, 1, 0];
const BLUE: [number, number, number] = [0, 0, 1];
const YELLOW: [number, number, number] = [1, 1, 0];
const WHITE: [number, number, number] = [1, 1, 1];
const ORANGE: [number, number, number] = [1, 0.6, 0];

interface Faces {
    front: [number, number, number],
    right: [number, number, number],
    top: [number, number, number],
    left: [number, number, number],
    bottom: [number, number, number],
    back: [number, number, number],
}

export interface RubikCube {
    cubes: Cube[],
}

export interface RotationMat {
    values: [number, number, number,
        number, number, number,
        number, number, number]
}

function multiply({values}: RotationMat, vec: [number, number, number]): [number, number, number] {
    return [
        values[0] * vec[0] + values[1] * vec[1] + values[2] * vec[2],
        values[3] * vec[0] + values[4] * vec[1] + values[5] * vec[2],
        values[6] * vec[0] + values[7] * vec[1] + values[8] * vec[2]
    ];
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

export function rotateLayerX(rubik: RubikCube, layerIndex: number): void {
    const rotation: RotationMat = { values:
                [1, 0, 0,
                 0, 0, 1,
                 0, -1, 0]
        };
    rubik.cubes
        .filter(cube => cube.position[0] == layerIndex)
        .forEach(cube => {
                cube.position = multiply(rotation, cube.position);
                cube.faces = {
                        ...cube.faces,
                        front: cube.faces.bottom,
                        top: cube.faces.front,
                        back: cube.faces.top,
                        bottom: cube.faces.back,
                };
        });
}

export function rotateLayerY(rubik: RubikCube, layerIndex: number): void {
    const rotation: RotationMat = { values:
            [0, 0, 1,
             0, 1, 0,
             -1, 0, 0]
    };
    rubik.cubes
        .filter(cube => cube.position[1] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(rotation, cube.position);
            cube.faces = {
                ...cube.faces,
                front: cube.faces.left,
                right: cube.faces.front,
                back: cube.faces.right,
                left: cube.faces.back,
            };
        });
}

export function rotateLayerZ(rubik: RubikCube, layerIndex: number): void {
    const rotation: RotationMat = { values:
            [0, -1, 0,
             1, 0, 0,
             0, 0, 1]
    };
    rubik.cubes
        .filter(cube => cube.position[2] == layerIndex)
        .forEach(cube => {
            cube.position = multiply(rotation, cube.position);
            cube.faces = {
                ...cube.faces,
                top: cube.faces.right,
                left: cube.faces.top,
                bottom: cube.faces.left,
                right: cube.faces.bottom,
            };
        });
}
