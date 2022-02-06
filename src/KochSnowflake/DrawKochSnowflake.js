import React from "react";
import measureTime from '../Utils/measureTime';
import CanvasContainer from "../Canvas/CanvasContainer";

class DrawKochSnowflake extends React.Component {

    // https://www.section.io/engineering-education/desktop-application-with-react/
    // https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

    constructor(props) {
        super(props);

        this.canvasProps = {
            width: props.width,
            height: props.height,
        };
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

        canvas.clearCanvas();

        // NOTE stack size exceeds with stepCount = 9 (at least on my computer) !
        if (this.stepCount > 8) {
            canvas.drawText('too many recursion steps (max. 8) !', 30, 50);
            return;
        }

        canvas.drawText(this.calculationType, 10, 20);

        let x = 100;
        let y = 110;
        let length = 300 / 3 ** this.stepCount;
        let angle = 0;

        canvas.drawText(`${this.rule.length} segments`, 10, 40);
        if (this.calculationType === 'recursive') {

            canvas.drawText(`${this.recursionCount} recursions`, 10, 60);

        } else if (this.calculationType === 'iterative') {

            canvas.drawText(`${this.iterationCount} iterations`, 10, 60);

        }
        canvas.drawText(`${this.joinCount} joins`, 10, 80);
        canvas.drawText(`calculation time: ${this.calculationTime} ms`, 10, 360);

        const drawTime = measureTime(() => {

            canvas.drawLineInit(x, y);

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

                canvas.drawLine(x, y);
            });

            canvas.drawLineFinish();
        });

        canvas.drawText(`draw time: ${drawTime} ms`, 10, 380);
    }

    render() {
        return <CanvasContainer
            ref={this.canvasContainerRef}
            canvasProps={this.canvasProps}
        />
    }
};

export default DrawKochSnowflake;
