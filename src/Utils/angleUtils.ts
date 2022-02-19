
export const RAD_TO_DEG = 180.0 / Math.PI;

export const angleRadToDeg = (angle: number, digits?: number) => {

    let digitsFactor = 1;

    if (!!digits) {
        digitsFactor = 10 ** digits;
    }

    return Math.round(angle * RAD_TO_DEG * digitsFactor) / digitsFactor;
};

export const angleDegToRad = (angle: number) => {

    return angle / RAD_TO_DEG;
};
