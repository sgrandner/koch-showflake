import React, { RefObject } from 'react';
import { connect } from 'react-redux';

import CanvasContainer from '../Canvas/CanvasContainer';
import { RootState } from '../Store/rootReducer';
import measureTime from '../Utils/measureTime';
import { calculatePath } from './calculatePath';
import { MAX_STEPS } from './KochSnowflake';

type DrawKochSnowflakeProps = {
    canvasProps: { width: string, height: string };
    stepCount: number;
    calculationType: 'recursive' | 'iterative';
    resultRule: string;
    resultRule0: string;
    resultRule1: string;
    anglePlus?: number;
    angleMinus?: number;
    offsetX: number;
    offsetY: number;

    recursionCount: number;
    iterationCount: number;
    calculationTime: number;
    joinCount: number;
};

class DrawKochSnowflake extends React.Component<DrawKochSnowflakeProps> {

    // https://www.section.io/engineering-education/desktop-application-with-react/
    // https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

    canvasContainerRef: RefObject<CanvasContainer>;

    canvasOffset = { x: 600, y: 600 };
    zoom = 1;
    drawTime = 0;
    updateCount = 0;

    constructor(props: DrawKochSnowflakeProps) {

        super(props);
        this.canvasContainerRef = React.createRef();
    }

    componentDidMount() {
        this.draw();
    }

    // FIXME maybe to often, trigger drawing on props change instead ?!
    componentDidUpdate() {

        // FIXME initial offset for presets overwrites offset for every settings change !
        // this.offset = {
        //     x: this.props.offsetX,
        //     y: this.props.offsetY,
        // }

        this.draw();
    }

    draw(): void {

        const canvas = this.canvasContainerRef.current;

        canvas?.clearCanvas();

        if (!(this.props.stepCount >= 0 && this.props.stepCount <= MAX_STEPS)) {
            canvas?.drawText(30, 50, `too many recursion steps (max. ${MAX_STEPS}) !`);
            return;
        }

        let recursionIterationCountText;
        if (this.props.calculationType === 'recursive') {
            recursionIterationCountText = `${this.props.recursionCount} recursions`;
        } else if (this.props.calculationType === 'iterative') {
            recursionIterationCountText = `${this.props.iterationCount} iterations`;
        }

        canvas?.drawTextLines(
            20,
            40,
            this.props.calculationType,
            `${this.props.resultRule.length} segments`,
            recursionIterationCountText || '',
            `${this.props.joinCount} joins`,
        );

        const transformX = (x: number): number => {
            return x * this.zoom + this.canvasOffset.x;
        };

        const transformY = (y: number): number => {
            return y * this.zoom + this.canvasOffset.y;
        };

        const x0 = 0;
        const y0 = 0;

        this.drawTime = measureTime(() => {

            canvas?.drawLineInit(transformX(x0), transformY(y0));

            const growthFactor = this.calculateGrowthFactor();

            calculatePath({
                x0,
                y0,
                stepCount: this.props.stepCount,
                anglePlus: this.props.anglePlus,
                angleMinus: this.props.angleMinus,
                resultRule: this.props.resultRule,
                growthFactor,
                drawCallback: (x: number, y: number) => {
                    canvas?.drawLine(transformX(x), transformY(y));
                }
            });

            canvas?.drawLineFinish();
        });

        canvas?.drawTextLines(
            20,
            1450,
            `calculation time: ${this.props.calculationTime} ms`,
            `draw time: ${this.drawTime} ms`,
            `zoom: ${this.zoom}`,
            `canvasOffset: (${this.canvasOffset.x}, ${this.canvasOffset.y})`,
        );
    }

    calculateGrowthFactor(): number {

        let length0 = 0;
        let length1 = 0;

        // NOTE length of path for step 0
        calculatePath({
            x0: 0,
            y0: 0,
            stepCount: 0,
            anglePlus: this.props.anglePlus,
            angleMinus: this.props.angleMinus,
            resultRule: this.props.resultRule0,
            growthFactor: 1,
            drawCallback: (x: number, y: number) => {
                length0 = Math.sqrt(x ** 2 + y ** 2);
            }
        });

        // NOTE length of path for step 1
        calculatePath({
            x0: 0,
            y0: 0,
            stepCount: 1,
            anglePlus: this.props.anglePlus,
            angleMinus: this.props.angleMinus,
            resultRule: this.props.resultRule1,
            growthFactor: 1,
            drawCallback: (x: number, y: number) => {
                length1 = Math.sqrt(x ** 2 + y ** 2);
            }
        });

        if (length0 === 0 || length1 === 0) {
            return 1;
        }

        return length1 / length0;
    }

    handleMouseDrag(canvasOffset: { x: number, y: number }): void {

        this.canvasOffset = canvasOffset;

        if (this.props.calculationTime + this.drawTime <= 10) {
            this.draw();
        }
    }

    handleOnMouseDragFinish(): void {
        this.draw();
    }

    handleZoom(zoom: number): void {
        
        this.zoom = zoom;
        this.draw();
    }

    render() {
        return (
            <div>
                <CanvasContainer
                    ref={this.canvasContainerRef}
                    canvasProps={this.props.canvasProps}
                    onMouseDrag={this.handleMouseDrag.bind(this)}
                    onMouseDragFinish={this.handleOnMouseDragFinish.bind(this)}
                    onZoom={this.handleZoom.bind(this)}
                />

                <div>update count: {++this.updateCount}</div>
            </div>
        )
    }
};

const mapStateToProps = (state: RootState) => ({
    anglePlus: state.settings.anglePlus,
    angleMinus: state.settings.angleMinus,
    offsetX: state.settings.offsetX,
    offsetY: state.settings.offsetY,
});

export default connect(mapStateToProps)(DrawKochSnowflake);
