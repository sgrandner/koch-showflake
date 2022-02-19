export type CalculatePathProps = {
    x0: number;
    y0: number;
    stepCount: number;
    anglePlus: number | undefined;
    angleMinus: number | undefined;
    resultRule: string;
    drawCallback?: (x: number, y: number) => void;
};

const LENGTH_UNIT = 1000.0;

export const calculatePath = (props: CalculatePathProps) => {

    let x = props.x0;
    let y = props.y0;

    let length = LENGTH_UNIT / 3 ** props.stepCount;
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
                    props.drawCallback(x, y);
                }
        }
    }
};
