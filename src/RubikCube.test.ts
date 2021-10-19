import {
    createRubikCube,
    rotateLayerXClockwise,
    rotateLayerYClockwise,
    rotateLayerZClockwise,
    RubikCube
} from "./RubikCube";

describe("RubikCube", () => {
    describe("rotate along the x-axis", () => {
        it("the right layer red faces should be on the top after rotated clockwise", () => {
            const rubik = createRubikCube();
            const red = [1, 0, 0];
            const expectedTopColors = Array(9).fill(red);
            const layerIndex = 2;
            rotateLayerXClockwise(rubik, layerIndex);
            expect(filterTopFaceColorsAlongXAxis(rubik, layerIndex))
                .toEqual(expectedTopColors);
        });
        it("the middle layer red faces should be on the top after rotated clockwise", () => {
            const rubik = createRubikCube();
            const red = [1, 0, 0];
            const expectedTopColors = Array(9).fill(red);
            const layerIndex = 0;
            rotateLayerXClockwise(rubik, layerIndex);
            expect(filterTopFaceColorsAlongXAxis(rubik, layerIndex))
                .toEqual(expectedTopColors);
        });
        it("the left layer red faces should be on the top after rotated clockwise", () => {
            const rubik = createRubikCube();
            const red = [1, 0, 0];
            const expectedTopColors = Array(9).fill(red);
            const layerIndex = -2;
            rotateLayerXClockwise(rubik, layerIndex);
            expect(filterTopFaceColorsAlongXAxis(rubik, layerIndex))
                .toEqual(expectedTopColors);
        });

        function filterTopFaceColorsAlongXAxis(rubik: RubikCube, layerIndex: number): [number, number, number][] {
            return rubik.cubes.filter(cube => cube.position[0] === layerIndex)
                .map(cube => cube.faces.top.rgb);
        }
    });
    describe("rotate along the y-axis", () => {
        it("the top layer red faces should be on the right after rotated clockwise", () => {
            const rubik = createRubikCube();
            const red = [1, 0, 0];
            const expectedTopColors = Array(9).fill(red);
            const layerIndex = 2;
            rotateLayerYClockwise(rubik, layerIndex);
            expect(filterRightFaceColorsAlongYAxis(rubik, layerIndex))
                .toEqual(expectedTopColors);
        });
        it("the middle layer red faces should be on the right after rotated clockwise", () => {
            const rubik = createRubikCube();
            const red = [1, 0, 0];
            const expectedTopColors = Array(9).fill(red);
            const layerIndex = 0;
            rotateLayerYClockwise(rubik, layerIndex);
            expect(filterRightFaceColorsAlongYAxis(rubik, layerIndex))
                .toEqual(expectedTopColors);
        });
        it("the bottom layer red faces should be on the right after rotated clockwise", () => {
            const rubik = createRubikCube();
            const red = [1, 0, 0];
            const expectedTopColors = Array(9).fill(red);
            const layerIndex = -2;
            rotateLayerYClockwise(rubik, layerIndex);
            expect(filterRightFaceColorsAlongYAxis(rubik, layerIndex))
                .toEqual(expectedTopColors);
        });

        function filterRightFaceColorsAlongYAxis(rubik: RubikCube, layerIndex: number): [number, number, number][] {
            return rubik.cubes.filter(cube => cube.position[1] === layerIndex)
                .map(cube => cube.faces.right.rgb);
        }
    });
    describe("rotate along the z-axis", () => {
        it("the front layer blue faces should be on the bottom after rotated clockwise", () => {
            const rubik = createRubikCube();
            const blue = [0, 0, 1];
            const expectedBottomColors = Array(9).fill(blue);
            const layerIndex = 2;
            rotateLayerZClockwise(rubik, layerIndex);
            expect(filterBottomFaceColorsAlongZAxis(rubik, layerIndex))
                .toEqual(expectedBottomColors);
        });
        it("the middle layer red faces should be on the bottom after rotated clockwise", () => {
            const rubik = createRubikCube();
            const blue = [0, 0, 1];
            const expectedBottomColors = Array(9).fill(blue);
            const layerIndex = 0;
            rotateLayerZClockwise(rubik, layerIndex);
            expect(filterBottomFaceColorsAlongZAxis(rubik, layerIndex))
                .toEqual(expectedBottomColors);
        });
        it("the back layer red faces should be on the bottom after rotated clockwise", () => {
            const rubik = createRubikCube();
            const blue = [0, 0, 1];
            const expectedBottomColors = Array(9).fill(blue);
            const layerIndex = -2;
            rotateLayerZClockwise(rubik, layerIndex);
            expect(filterBottomFaceColorsAlongZAxis(rubik, layerIndex))
                .toEqual(expectedBottomColors);
        });

        function filterBottomFaceColorsAlongZAxis(rubik: RubikCube, layerIndex: number): [number, number, number][] {
            return rubik.cubes.filter(cube => cube.position[2] === layerIndex)
                .map(cube => cube.faces.bottom.rgb);
        }
    });
});