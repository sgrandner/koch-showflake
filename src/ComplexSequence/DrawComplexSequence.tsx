import React, { RefObject } from 'react';

import { CanvasBox } from '../_domain/CanvasBox';
import { Complex } from '../_domain/Complex';
import { Point } from '../_domain/Point';
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
    canvasContainerRef2: RefObject<CanvasContainer>;

    calculationDrawTime = 0;
    updateCount = 0;

    selectedPoint: Point | undefined;
    sequenceAbsoluteValues: number[] | undefined;

    constructor(props: DrawComplexSequenceProps) {

        super(props);
        this.canvasContainerRef = React.createRef();
        this.canvasContainerRef2 = React.createRef();
    }

    componentDidMount() {
        this.draw();
    }

    // FIXME maybe to often, trigger drawing on props change instead ?!
    componentDidUpdate() {
        this.draw();
    }

    calculateMandelbrot(x: number, y: number, storeSequence?: boolean): number | undefined {

        const thresholdSquared = 10;
        let iterationCount = undefined;

        const c: Complex = { re: x, im: y };
        let z: Complex = { re: 0, im: 0 };

        if (storeSequence) {
            this.sequenceAbsoluteValues = [];
        }

        for (let index = 0; index < this.props.iterationMax; index++) {

            const zTemp: Complex = {
                re: z.re ** 2 - z.im ** 2 + c.re,
                im: 2 * z.re * z.im + c.im,
            };

            z = zTemp;

            const absoluteValue = z.re ** 2 + z.im ** 2;

            if (storeSequence) {
                this.sequenceAbsoluteValues?.push(absoluteValue);
            }
            
            if (absoluteValue > thresholdSquared) {
                iterationCount = index;
                break;
            }
        }

        return iterationCount;
    }

    draw(dragBorderBoxes?: CanvasBox[]): void {

        const canvas = this.canvasContainerRef.current;

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

                            const iterationCount = this.calculateMandelbrot(point.x, point.y);

                            const colorValue = iterationCount !== undefined ? iterationCount * 20 % 155 + 100 : 0;
                            const color = {
                                r: colorValue * 1.0,
                                g: colorValue * 1.0,
                                b: colorValue * 0.2,
                            };
                            
                            canvas?.drawPixel({ cx, cy }, color.r, color.g, color.b);
                        }
                    }
                }
            });

            canvas?.drawPixelsFinish();
            
            canvas?.drawLineTransformedInit({ x: -1000, y: 0 });
            canvas?.drawLineTransformed({ x: 1000, y: 0 });
            canvas?.drawLineFinish();
            canvas?.drawLineTransformedInit({ x: 0, y: -1000 });
            canvas?.drawLineTransformed({ x: 0, y: 1000 });
            canvas?.drawLineFinish();

            if (!dragBorderBoxes) {

                canvas?.drawTextLines(
                    { cx: 20, cy: 20 },
                    `calculation and draw time: ${this.calculationDrawTime} ms`,
                    `selected point: ${this.selectedPoint?.x}, ${this.selectedPoint?.y}`,
                );
            }

        });
    }

    drawSequence(): void {

        const canvas = this.canvasContainerRef2.current;

        canvas?.clearCanvas();

        // NOTE in strict mode the optional chaining operator does not work with comparison of numbers, thus the old way of null safety :/
        if (!!this.sequenceAbsoluteValues && this.sequenceAbsoluteValues.length > 0) {
            
            canvas?.drawLineTransformedInit({ x: 0, y: 0 });

            for (let index = 0; index < this.sequenceAbsoluteValues.length; index++) {
                const value = this.sequenceAbsoluteValues[ index ];
                
                const canvasPoint = canvas?.transformToCanvasCoords({
                    x: index,
                    y: value,
                })
                if (!!canvasPoint) {
                    canvas?.drawLineTransformed({
                        x: index,
                        y: value,
                    });
                }
            }

            canvas?.drawLineFinish();
        }

        canvas?.drawLineTransformedInit({ x: -5, y: 0 });
        canvas?.drawLineTransformed({ x: 100, y: 0 });
        canvas?.drawLineFinish();
        canvas?.drawLineTransformedInit({ x: 0, y: -5 });
        canvas?.drawLineTransformed({ x: 0, y: 20 });
        canvas?.drawLineFinish();
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

    handleMouseRightClick(point: Point): void {

        this.selectedPoint = point;
        this.calculateMandelbrot(point.x, point.y, true);
        this.drawSequence();
    }

    render() {
        return (
            <div>
                <CanvasContainer
                    ref={this.canvasContainerRef}
                    canvasProps={this.props.canvasProps}
                    initialZoom={200}
                    initialOffset={{ cx: 150, cy: 0 }}
                    onMouseDrag={this.handleMouseDrag.bind(this)}
                    onMouseDragFinish={this.handleMouseDragFinish.bind(this)}
                    onZoom={this.handleZoom.bind(this)}
                    onMouseRightClick={this.handleMouseRightClick.bind(this)}
                />

                <CanvasContainer
                    ref={this.canvasContainerRef2}
                    canvasProps={{ width: '600', height: '200', foregroundColor: '#000000', backgroundColor: '#ffffff' }}
                    initialCenter={{ cx: 50, cy: 150 }}
                    initialZoom={10}
                />
            </div>
        )
    }
};

// const mapStateToProps = (state: RootState) => ({
// });

// export default connect(mapStateToProps)(DrawComplexSequence);
export default DrawComplexSequence;

