import {
    multiply,
    ROTATION_X_AXIS_NINETY_DEGREES_CLOCKWISE,
    ROTATION_X_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE,
    ROTATION_Y_AXIS_NINETY_DEGREES_CLOCKWISE,
    ROTATION_Y_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE,
    ROTATION_Z_AXIS_NINETY_DEGREES_CLOCKWISE,
    ROTATION_Z_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE
} from "./Matrix";

describe("multiply rotation matrix with vector", () => {
    it("should be rotated by 90 degrees counterclockwise around the x-axis", () => {
        const vec: [number, number, number] = [1, 1, 1];
        const rotated = multiply(ROTATION_X_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE, vec);
        expect(rotated).toEqual([1, -1, 1]);
    });
    it("should be rotated by 90 degrees clockwise around the x-axis", () => {
        const vec: [number, number, number] = [1, 1, 1];
        const rotated = multiply(ROTATION_X_AXIS_NINETY_DEGREES_CLOCKWISE, vec);
        expect(rotated).toEqual([1, 1, -1]);
    });
    it("should be rotated by 90 degrees counterclockwise around the y-axis", () => {
        const vec: [number, number, number] = [1, 1, 1];
        const rotated = multiply(ROTATION_Y_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE, vec);
        expect(rotated).toEqual([1, 1, -1]);
    });
    it("should be rotated by 90 degrees clockwise around the y-axis", () => {
        const vec: [number, number, number] = [1, 1, 1];
        const rotated = multiply(ROTATION_Y_AXIS_NINETY_DEGREES_CLOCKWISE, vec);
        expect(rotated).toEqual([-1, 1, 1]);
    });
    it("should be rotated by 90 degrees counterclockwise around the z-axis", () => {
        const vec: [number, number, number] = [1, 1, 1];
        const rotated = multiply(ROTATION_Z_AXIS_NINETY_DEGREES_COUNTERCLOCKWISE, vec);
        expect(rotated).toEqual([-1, 1, 1]);
    });
    it("should be rotated by 90 degrees clockwise around the z-axis", () => {
        const vec: [number, number, number] = [1, 1, 1];
        const rotated = multiply(ROTATION_Z_AXIS_NINETY_DEGREES_CLOCKWISE, vec);
        expect(rotated).toEqual([1, -1, 1]);
    });
});