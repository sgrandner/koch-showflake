import React, { RefObject } from 'react';

import CanvasContainer from '../Canvas/CanvasContainer';
import measureTime from '../Utils/measureTime';

type DrawKochSnowflakeProps = {
    canvasProps: { width: string, height: string };
    stepCount: number;
    calculationType: 'recursive' | 'iterative';
    recursionCount: number;
    iterationCount: number;
    calculationTime: number;
    joinCount: number;
    rule: string[];
};

class DrawKochSnowflake extends React.Component<DrawKochSnowflakeProps> {

    // https://www.section.io/engineering-education/desktop-application-with-react/
    // https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

    canvasProps: { width: string, height: string };
    stepCount: number;
    calculationType: 'recursive' | 'iterative';
    recursionCount: number;
    iterationCount: number;
    calculationTime: number;
    joinCount: number;
    rule: string[];

    canvasContainerRef: RefObject<CanvasContainer>;

    constructor(props: DrawKochSnowflakeProps) {

        super(props);

        this.canvasProps = props.canvasProps;
        this.stepCount = props.stepCount;
        this.calculationType = props.calculationType;
        this.recursionCount = props.recursionCount;
        this.iterationCount = props.iterationCount;
        this.calculationTime = props.calculationTime;
        this.joinCount = props.joinCount;
        this.rule = props.rule;

        this.canvasContainerRef = React.createRef();
    }

    componentDidMount() {

        const canvas = this.canvasContainerRef.current;

        canvas?.clearCanvas();

        if (this.stepCount > 8) {
            canvas?.drawText(30, 50, 'too many recursion steps (max. 8) !');
            return;
        }

        let x = 200;
        let y = 220;
        let length = 600 / 3 ** this.stepCount;
        let angle = 0;

        let recursionIterationCountText;
        if (this.calculationType === 'recursive') {
            recursionIterationCountText = `${this.recursionCount} recursions`;
        } else if (this.calculationType === 'iterative') {
            recursionIterationCountText = `${this.iterationCount} iterations`;
        }

        canvas?.drawTextLines(
            20,
            40,
            this.calculationType,
            `${this.rule.length} segments`,
            recursionIterationCountText || '',
            `${this.joinCount} joins`,
        );

        const drawTime = measureTime(() => {

            canvas?.drawLineInit(x, y);

            this.rule.forEach(element => {

                switch (element) {
                    case 'L':
                        angle += Math.PI / 3.0;
                        break;
                    case 'R':
                        angle -= 2.0 * Math.PI / 3.0;
                        break;
                    default:
                        break;
                }

                x += Math.cos(angle) * length;
                y -= Math.sin(angle) * length;

                canvas?.drawLine(x, y);
            });

            canvas?.drawLineFinish();
        });

        canvas?.drawTextLines(
            20,
            720,
            `calculation time: ${this.calculationTime} ms`,
            `draw time: ${drawTime} ms`,
        );
    }

    render() {
        return <CanvasContainer
            ref={this.canvasContainerRef}
            canvasProps={this.canvasProps}
        />
    }
};

export default DrawKochSnowflake;
