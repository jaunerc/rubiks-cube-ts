export interface Cube {
    position: number[],
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
                cubes.push({position: [x, y, z]});
            }
        }
    }
    return {cubes};
}
