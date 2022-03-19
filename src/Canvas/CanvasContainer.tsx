import './CanvasContainer.css';

import React, { RefObject } from 'react';

import { CanvasBox } from '../_domain/CanvasBox';
import { CanvasPoint } from '../_domain/CanvasPoint';
import { Point } from '../_domain/Point';

const DEFAULT_FOREGROUND_COLOR = '#ffffff';
const DEFAULT_BACKGROUND_COLOR = '#000000';

enum Zoom {
    IN,
    OUT,
}

type CanvasContainerProps = {
    canvasProps: {
        width: string,
        height: string,
        foregroundColor?: string,
        backgroundColor?: string,
    };
    initialCenter?: CanvasPoint | undefined;
    initialZoom?: number | undefined;
    initialOffset?: CanvasPoint | undefined;
    onMouseDrag?: (dragBorderBoxes: CanvasBox[]) => void | undefined;
    onMouseDragFinish?: () => void | undefined;
    onZoom?: () => void | undefined;
    onMouseRightClick?: (p: Point) => void | undefined;
};

class CanvasContainer extends React.Component<CanvasContainerProps> {

    canvasRef: RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | undefined | null;
    canvasData: ImageData | undefined;

    coordOffset: Point;
    coordOriginOnCanvas: CanvasPoint;
    center: CanvasPoint;
    dragActive = false;
    zoom: number;
    ZOOM_STEP = 1.5;

    constructor(props: CanvasContainerProps) {

        super(props);
        this.canvasRef = React.createRef();
        
        this.coordOffset = { x: 0, y: 0 };
        this.coordOriginOnCanvas = { cx: 0, cy: 0 };
        this.center = {
            cx: this.props.initialCenter?.cx || Number(this.props.canvasProps.width) * 0.5,
            cy: this.props.initialCenter?.cy || Number(this.props.canvasProps.height) * 0.5,
        };

        this.zoom = this.props.initialZoom || 1;

        this.determineOffset(this.props.initialOffset?.cx || 0, this.props.initialOffset?.cy || 0);
    }

    componentDidMount(): void {

        const canvas = this.canvasRef.current;

        if (!!canvas) {
            this.ctx = canvas.getContext('2d');
            this.getCanvasData();
        }
    }

    clearCanvas(): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.fillStyle = this.props.canvasProps.backgroundColor || DEFAULT_BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    determineDragBorderBoxes(offset: CanvasPoint): CanvasBox[] {

        const boxes: CanvasBox[] = [];

        if (!this.ctx) {
            return boxes;
        }

        const width = this.ctx.canvas.width;
        const height = this.ctx.canvas.height;
        
        if (offset.cx !== 0) {
            
            let cx1, cx2;
            
            if (offset.cx > 0) {
                cx1 = 0;
                cx2 = offset.cx;
            } else {
                cx1 = width + offset.cx;
                cx2 = width;
            }
            
            boxes.push({
                cx1,
                cy1: 0,
                cx2,
                cy2: height,
            });
        }
        
        if (offset.cy !== 0) {
            
            let cy1, cy2;

            if (offset.cy > 0) {
                cy1 = 0;
                cy2 = offset.cy;
            } else {
                cy1 = height + offset.cy;
                cy2 = height;
            }
            
            boxes.push({
                cx1: 0,
                cy1,
                cx2: width,
                cy2,
            });
        }

        return boxes;
    }

    getCanvasData(): void {
        
        this.canvasData = this.ctx?.getImageData(0, 0, Number(this.props.canvasProps.width), Number(this.props.canvasProps.height));
    }

    drawCanvasData(offset: CanvasPoint, dragBorderBoxes: CanvasBox[]): void {

        this.getCanvasData();

        if (this.canvasData) {
            this.ctx?.putImageData(this.canvasData, offset.cx, offset.cy);
        }

        dragBorderBoxes.forEach((box: CanvasBox) => {

            if (!this.ctx) {
                return;
            }

            this.ctx.fillStyle = this.props.canvasProps.backgroundColor || DEFAULT_BACKGROUND_COLOR;
            this.ctx.fillRect(box.cx1, box.cy1, box.cx2, box.cy2);
        });

        // NOTE update canvasData for using drawPixel afterwards !
        this.getCanvasData();
    }

    drawText(cp: CanvasPoint, text: string | undefined): void {

        if (!this.ctx || !text) {
            return;
        }

        this.ctx.font = '32px serif';
        this.ctx.fillStyle = this.props.canvasProps.foregroundColor || DEFAULT_FOREGROUND_COLOR;
        this.ctx.fillText(text, cp.cx, cp.cy);
    }

    drawTextLines(cp: CanvasPoint, ...textLines: string[]): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.font = '15px serif';
        this.ctx.fillStyle = this.props.canvasProps.foregroundColor || DEFAULT_FOREGROUND_COLOR;

        textLines.forEach((text, index) => {
            this.ctx?.fillText(text, cp.cx, cp.cy + index * 20);
        });
    }

    drawLineInit(cp: CanvasPoint): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.strokeStyle = this.props.canvasProps.foregroundColor || DEFAULT_FOREGROUND_COLOR;
        this.ctx.beginPath();
        this.ctx.moveTo(cp.cx, cp.cy);
    }

    drawLineTransformedInit(p: Point): void {

        this.drawLineInit(this.transformToCanvasCoords(p));
    }

    drawLine(cp: CanvasPoint): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.lineTo(cp.cx, cp.cy);
    }

    drawLineTransformed(p: Point): void {

        this.drawLine(this.transformToCanvasCoords(p));
    }

    drawLineFinish(): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.stroke();
    }

    // see https://stackoverflow.com/questions/7812514/drawing-a-dot-on-html5-canvas
    drawPixel(cp: CanvasPoint, r: number, g: number, b: number): void {

        if (!this.canvasData) {
            return;
        }

        const index = (cp.cx + cp.cy * Number(this.props.canvasProps.width)) * 4;

        this.canvasData.data[ index ] = r;
        this.canvasData.data[ index + 1 ] = g;
        this.canvasData.data[ index + 2 ] = b;
        this.canvasData.data[ index + 3 ] = 255;
    }

    drawPixelsFinish(): void {
        
        if (!this.canvasData) {
            return;
        }

        this.ctx?.putImageData(this.canvasData, 0, 0);
    }

    determineOffset(movementX = 0, movementY = 0): void {

        this.coordOffset = {
            x: this.coordOffset.x + movementX / this.zoom,
            y: this.coordOffset.y + movementY / this.zoom,
        };

        this.coordOriginOnCanvas = {
            cx: this.coordOffset.x * this.zoom + this.center.cx,
            cy: this.coordOffset.y * this.zoom + this.center.cy,
        };
    }

    transformToCoords(cp: CanvasPoint): Point {

        return {
            x: (cp.cx - this.coordOriginOnCanvas.cx) / this.zoom,
            y: -(cp.cy - this.coordOriginOnCanvas.cy) / this.zoom,
        };
    }

    transformToCanvasCoords(p: Point): CanvasPoint {
        return {
            cx: p.x * this.zoom + this.coordOriginOnCanvas.cx,
            cy: -p.y * this.zoom + this.coordOriginOnCanvas.cy,
        };
    };

    mouseDown($event: React.MouseEvent): void {
        
        switch ($event.button) {
            // left click
            case 0:
                this.dragActive = true;
                break;
            default:
                break;
        }
    }

    mouseUp($event: React.MouseEvent): void {
        
        this.dragActive = false;

        switch ($event.button) {
            // left click
            case 0:
                this.mouseUpLeft();
                break;
            // right click
            case 2:
                this.mouseUpRight($event);
                break;
            default:
                break;
        }
    }

    private mouseUpLeft(): void {

        if (!this.props?.onMouseDragFinish) {
            return;
        }

        this.props.onMouseDragFinish();
    }

    private mouseUpRight($event: React.MouseEvent): void {

        if (!this.props?.onMouseRightClick) {
            return;
        }

        const canvasClientRect = $event.currentTarget.getBoundingClientRect();

        if (isNaN(canvasClientRect?.x) || isNaN(canvasClientRect?.y)) {
            return;
        }

        const point: CanvasPoint = {
            cx: $event.clientX - canvasClientRect.x,
            cy: $event.clientY - canvasClientRect.y,
        };

        this.props.onMouseRightClick(this.transformToCoords(point));
    }

    mouseMove($event: React.MouseEvent): void {

        if (!this.dragActive) {
            return;
        }

        if (!this.props?.onMouseDrag) {
            return;
        }

        const offset = { cx: $event.movementX, cy: $event.movementY };

        this.determineOffset($event.movementX, $event.movementY);

        // TODO control this by config (fractal curves do not need this)
        const dragBorderBoxes = this.determineDragBorderBoxes(offset);
        this.drawCanvasData(offset, dragBorderBoxes);

        this.props.onMouseDrag(dragBorderBoxes);
    }

    zoomIn(): void {
        this.handleZoom(Zoom.IN);
    }

    zoomOut(): void {
        this.handleZoom(Zoom.OUT);
    }

    handleZoom(zoom: Zoom): void {

        if (!this.props?.onZoom) {
            return;
        }

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

        this.determineOffset();

        this.props.onZoom();
    }

    render() {
        return (
            <>
                <canvas
                    style={{ width: this.props.canvasProps.width, height: this.props.canvasProps.height }}
                    ref={this.canvasRef}
                    {...this.props.canvasProps}
                    onMouseDown={this.mouseDown.bind(this)}
                    onMouseUp={this.mouseUp.bind(this)}
                    onMouseMove={this.mouseMove.bind(this)}
                />
                <button onClick={this.zoomIn.bind(this)}>Zoom In</button>
                <button onClick={this.zoomOut.bind(this)}>Zoom Out</button>
            </>
        );
    }
}

export default CanvasContainer;
