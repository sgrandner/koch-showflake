import React, { RefObject } from 'react';

import CanvasContainer from '../Canvas/CanvasContainer';
import measureTime from '../Utils/measureTime';

type Color = {
    r: number;
    g: number;
    b: number;
}

type Complex = {
    re: number;
    im: number;
}

type DrawComplexSequenceProps = {
    canvasProps: { width: string, height: string };
};

class DrawComplexSequence extends React.Component<DrawComplexSequenceProps> {

    // https://www.section.io/engineering-education/desktop-application-with-react/
    // https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

    canvasContainerRef: RefObject<CanvasContainer>;

    calculationDrawTime = 0;
    updateCount = 0;

    constructor(props: DrawComplexSequenceProps) {

        super(props);
        this.canvasContainerRef = React.createRef();
    }

    componentDidMount() {
        this.draw();
    }

    // FIXME maybe to often, trigger drawing on props change instead ?!
    componentDidUpdate() {
        this.draw();
    }

    calculateMandelbrot(x: number, y: number): Color {

        const thresholdSquared = 10;
        const iterationMax = 2000;
        let iterationCount = undefined;

        const cRe = x;
        const cIm = y;
        let zRe = 0;
        let zIm = 0;

        for (let index = 0; index < iterationMax; index++) {

            const zReTemp = zRe ** 2 - zIm ** 2 + cRe;
            const zImTemp = 2 * zRe * zIm + cIm;

            zRe = zReTemp;
            zIm = zImTemp;
            
            if (zRe ** 2 + zIm ** 2 > thresholdSquared) {
                iterationCount = index;
                break;
            }
        }

        const colorValue = iterationCount !== undefined ? iterationCount * 2 % 155 + 100 : 0;
        return {
            r: colorValue,
            g: colorValue,
            b: 0,
        };
    }

    draw(): void {

        const canvas = this.canvasContainerRef.current;

        canvas?.clearCanvas();

        this.calculationDrawTime = measureTime(() => {

            const deltaX = 1;
            const deltaY = 1;
    
            for (let y = 0; y < Number(this.props.canvasProps.height); y += deltaX) {
                for (let x = 0; x < Number(this.props.canvasProps.width); x += deltaY) {
    
                    const point = canvas?.getCoordByCanvasCoord(x, y);
    
                    if (!!point) {
                        const color = this.calculateMandelbrot(point.x, point.y);
                        canvas?.drawPixel(x, y, color.r, color.g, color.b);
                    }
                }
            }
            canvas?.drawPixelsFinish();
    
            canvas?.drawLineTransformedInit(-1000, 0);
            canvas?.drawLineTransformed(1000, 0);
            canvas?.drawLineFinish();
            canvas?.drawLineTransformedInit(0, -1000);
            canvas?.drawLineTransformed(0, 1000);
            canvas?.drawLineFinish();

            canvas?.drawTextLines(
                20,
                20,
                `calculation and draw time: ${this.calculationDrawTime} ms`,
            );
        });

    }

    handleMouseDrag(): void {

        if (this.calculationDrawTime <= 100) {
            this.draw();
        }
    }

    handleMouseDragFinish(): void {
        this.draw();
    }

    handleZoom(): void {
        this.draw();
    }

    render() {
        return (
            <div>
                <CanvasContainer
                    ref={this.canvasContainerRef}
                    canvasProps={this.props.canvasProps}
                    onMouseDrag={this.handleMouseDrag.bind(this)}
                    onMouseDragFinish={this.handleMouseDragFinish.bind(this)}
                    onZoom={this.handleZoom.bind(this)}
                />

                <div>update count: {++this.updateCount}</div>
            </div>
        )
    }
};

// const mapStateToProps = (state: RootState) => ({
// });

// export default connect(mapStateToProps)(DrawComplexSequence);
export default DrawComplexSequence;

