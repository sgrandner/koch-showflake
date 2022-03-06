import { Point } from 'electron';

export type CalculatePathProps = {
    p0: Point;
    stepCount: number;
    anglePlus: number | undefined;
    angleMinus: number | undefined;
    resultRule: string;
    growthFactor: number;
    drawCallback?: (p: Point) => void;
};

const LENGTH_UNIT = 600.0;

export const calculatePath = (props: CalculatePathProps) => {

    let x = props.p0.x;
    let y = props.p0.y;

    let length = LENGTH_UNIT / props.growthFactor ** props.stepCount;
    let angle = 0;

    const anglePlus = props.anglePlus || 0;
    const angleMinus = props.angleMinus || 0;

    for (let i = 0; i < props.resultRule.length; i++) {

        const element = props.resultRule.charAt(i);

        switch (element) {
            case '+':
                angle += anglePlus;
                break;

            case '-':
                angle += angleMinus;
                break;

            default:
                x += Math.cos(angle) * length;
                y -= Math.sin(angle) * length;

                if (typeof props.drawCallback === 'function') {
                    props.drawCallback({ x, y });
                }
        }
    }
};
