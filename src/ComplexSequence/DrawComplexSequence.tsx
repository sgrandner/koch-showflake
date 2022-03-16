import React, { RefObject } from 'react';

import { CanvasBox } from '../_domain/CanvasBox';
import { Color } from '../_domain/Color';
import { Complex } from '../_domain/Complex';
import CanvasContainer from '../Canvas/CanvasContainer';
import measureTime from '../Utils/measureTime';

type DrawComplexSequenceProps = {
    canvasProps: { width: string, height: string };
    iterationMax: number;
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
        let iterationCount = undefined;

        const c: Complex = { re: x, im: y };
        let z: Complex = { re: 0, im: 0 };


        for (let index = 0; index < this.props.iterationMax; index++) {

            const zTemp: Complex = {
                re: z.re ** 2 - z.im ** 2 + c.re,
                im: 2 * z.re * z.im + c.im,
            };

            z = zTemp;
            
            if (z.re ** 2 + z.im ** 2 > thresholdSquared) {
                iterationCount = index;
                break;
            }
        }

        const colorValue = iterationCount !== undefined ? iterationCount * 20 % 155 + 100 : 0;
        return {
            r: colorValue,
            g: colorValue * 0.7,
            b: 0,
        };
    }

    draw(dragBorderBoxes?: CanvasBox[]): void {

        const canvas = this.canvasContainerRef.current;

        // canvas?.clearCanvas();

        const drawBoxes: CanvasBox[] = [];

        if (!!dragBorderBoxes) {

            drawBoxes.push(...dragBorderBoxes);

        } else {

            drawBoxes.push(
                {
                    cx1: 0,
                    cy1: 0,
                    cx2: Number(this.props.canvasProps.width),
                    cy2: Number(this.props.canvasProps.height),
                },
            );
        }

        this.calculationDrawTime = measureTime(() => {

            const deltaX = 1;
            const deltaY = 1;
    
            drawBoxes.forEach((box: CanvasBox) => { 

                for (let cx = box.cx1; cx < box.cx2; cx += deltaY) {
                    for (let cy = box.cy1; cy < box.cy2; cy += deltaX) {
        
                        const point = canvas?.transformToCoords({ cx, cy });
        
                        if (!!point) {
                            const color = this.calculateMandelbrot(point.x, point.y);
                            canvas?.drawPixel({ cx, cy }, color.r, color.g, color.b);
                        }
                    }
                }
            });

            canvas?.drawPixelsFinish();
            
            canvas?.drawLineTransformedInit({ x: -1000, y: 0});
            canvas?.drawLineTransformed({ x: 1000, y: 0});
            canvas?.drawLineFinish();
            canvas?.drawLineTransformedInit({ x: 0, y: -1000});
            canvas?.drawLineTransformed({ x: 0, y: 1000});
            canvas?.drawLineFinish();

            if (!dragBorderBoxes) {

                canvas?.drawTextLines(
                    { cx: 20, cy: 20 },
                    `calculation and draw time: ${this.calculationDrawTime} ms`,
                );
            }

        });
    }

    handleMouseDrag(dragBorderBoxes: CanvasBox[]): void {

        // FIXME calculationDrawTime is still large from complete calculation !!! should be resetted for dragging
        if (this.calculationDrawTime <= 1000) {
            this.draw(dragBorderBoxes);
        }
    }

    // TODO only calculate and draw new values as for dragging
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
                    initialZoom={200}
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

