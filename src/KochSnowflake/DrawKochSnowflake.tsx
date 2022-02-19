import React, { RefObject } from 'react';
import { connect } from 'react-redux';

import CanvasContainer from '../Canvas/CanvasContainer';
import { RootState } from '../Store/rootReducer';
import measureTime from '../Utils/measureTime';
import { calculatePath } from './calculatePath';
import { MAX_STEPS } from './KochSnowflake';

enum Zoom {
    IN,
    OUT,
}

type DrawKochSnowflakeProps = {
    canvasProps: { width: string, height: string };
    stepCount: number;
    calculationType: 'recursive' | 'iterative';
    resultRule: string;
    anglePlus?: number;
    angleMinus?: number;

    recursionCount: number;
    iterationCount: number;
    calculationTime: number;
    joinCount: number;
};

class DrawKochSnowflake extends React.Component<DrawKochSnowflakeProps> {

    // https://www.section.io/engineering-education/desktop-application-with-react/
    // https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

    canvasContainerRef: RefObject<CanvasContainer>;

    offset = { x: 200, y: 220 };
    zoom = 1;
    drawTime = 0;
    updateCount = 0;

    center = { x: 0, y: 0 };
    ZOOM_STEP = 1.5;

    constructor(props: DrawKochSnowflakeProps) {

        super(props);
        this.canvasContainerRef = React.createRef();

        this.center.x = Number(this.props.canvasProps.width) / 2;
        this.center.y = Number(this.props.canvasProps.height) / 2;
    }

    componentDidMount() {
        this.draw();
    }

    // FIXME maybe to often, trigger drawing on props change instead ?!
    componentDidUpdate() {
        this.draw();
    }

    draw() {

        const canvas = this.canvasContainerRef.current;

        canvas?.clearCanvas();

        if (this.props.stepCount > MAX_STEPS) {
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

        const canvasOffsetX = (this.offset.x - this.center.x) * this.zoom + this.center.x;
        const canvasOffsetY = (this.offset.y - this.center.y) * this.zoom + this.center.y;

        const transformX = (x: number): number => {
            return x * this.zoom + canvasOffsetX;
        };

        const transformY = (y: number): number => {
            return y * this.zoom + canvasOffsetY;
        };

        const x0 = 0;
        const y0 = 0;

        this.drawTime = measureTime(() => {

            canvas?.drawLineInit(transformX(x0), transformY(y0));

            calculatePath({
                x0,
                y0,
                stepCount: this.props.stepCount,
                anglePlus: this.props.anglePlus,
                angleMinus: this.props.angleMinus,
                resultRule: this.props.resultRule,
                drawCallback: (x: number, y: number) => {
                    canvas?.drawLine(transformX(x), transformY(y));
                }
            });

            canvas?.drawLineFinish();
        });

        canvas?.drawTextLines(
            20,
            650,
            `calculation time: ${this.props.calculationTime} ms`,
            `draw time: ${this.drawTime} ms`,
            `zoom: ${this.zoom}`,
            `offet: (${this.offset.x}, ${this.offset.y})`,
        );
    }

    handleMouseDrag(drag: { x: number, y: number }) {

        const newOffset = {
            x: this.offset.x + drag.x / this.zoom,
            y: this.offset.y + drag.y / this.zoom,
        };

        this.offset = newOffset;

        if (this.props.calculationTime + this.drawTime <= 10) {
            this.draw();
        }
    }

    handleOnMouseDragFinish() {
        this.draw();
    }

    zoomIn() {
        this.handleZoom(Zoom.IN);
    }

    zoomOut() {
        this.handleZoom(Zoom.OUT);
    }

    handleZoom(zoom: Zoom) {

        switch (zoom) {
            case Zoom.IN:
                this.zoom *= this.ZOOM_STEP;
                break;
            case Zoom.OUT:
                this.zoom /= this.ZOOM_STEP;
                break;
            default:
                break;
        }

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
                />
                <button onClick={this.zoomIn.bind(this)}>Zoom In</button>
                <button onClick={this.zoomOut.bind(this)}>Zoom Out</button>

                <div>update count: {++this.updateCount}</div>
            </div>
        )
    }
};

const mapStateToProps = (state: RootState) => ({
    anglePlus: state.settings.anglePlus,
    angleMinus: state.settings.angleMinus,
});

export default connect(mapStateToProps)(DrawKochSnowflake);
