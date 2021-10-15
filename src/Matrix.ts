
export interface Mat3x3 {
    values: [number, number, number,
        number, number, number,
        number, number, number]
}

export const ROTATION_X_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE: Mat3x3 = {
    values: [
        1, 0, 0,
        0, 0, -1,
        0, 1, 0
    ]
}

export const ROTATION_X_AXIS_NINETY_DEGREES_CLOCKWISE: Mat3x3 = {
    values: [
        1, 0, 0,
        0, 0, 1,
        0, -1, 0
    ]
}

export const ROTATION_Y_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE: Mat3x3 = {
    values: [
        0, 0, 1,
        0, 1, 0,
        -1, 0, 0
    ]
}

export const ROTATION_Y_AXIS_NINETY_DEGREES_CLOCKWISE: Mat3x3 = {
    values: [
        0, 0, -1,
        0, 1, 0,
        1, 0, 0
    ]
}

export const ROTATION_Z_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE: Mat3x3 = {
    values: [
        0, -1, 0,
        1, 0, 0,
        0, 0, 1
    ]
}

export const ROTATION_Z_AXIS_NINETY_DEGREES_CLOCKWISE: Mat3x3 = {
    values: [
        0, 1, 0,
        -1, 0, 0,
        0, 0, 1
    ]
}

export function multiply({values}: Mat3x3, vec: [number, number, number]): [number, number, number] {
    return [
        values[0] * vec[0] + values[1] * vec[1] + values[2] * vec[2],
        values[3] * vec[0] + values[4] * vec[1] + values[5] * vec[2],
        values[6] * vec[0] + values[7] * vec[1] + values[8] * vec[2]
    ];
}