export interface Cube {
    position: [number, number, number],
    rotation: [number, number, number],
}

export interface RubikCube {
    cubes: Cube[],
}

export interface RotationMat {
    values: [number, number, number,
        number, number, number,
        number, number, number]
}

function multiply({ values }: RotationMat, vec: [number, number, number]): [number, number, number] {
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
                    rotation: [0, 0, 0],
                });
            }
        }
    }
    return {cubes};
}

export function rotateRubikCube(rubik: RubikCube): RubikCube {
    const rotation: RotationMat = { values:
            [0, 0, 1,
             0, 1, 0,
            -1, 0, 0]
    }

    const rotationAngle = (90 * Math.PI) / 180.0;
    let face: Cube[] = [];
    rubik.cubes
        .filter(cube => cube.position[1] === 2)
        .forEach(cube => {
            face.push({
                position: multiply(rotation, cube.position),
                rotation: [0, rotationAngle, 0],
            });
        });
    const notRotatedCubes = rubik.cubes.filter(cube => cube.position[1] !== 2)

    return { cubes: [...face, ...notRotatedCubes]};
}
