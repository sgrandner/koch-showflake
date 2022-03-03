import './CanvasContainer.css';

import React, { RefObject } from 'react';

enum Zoom {
    IN,
    OUT,
}

type CanvasContainerProps = {
    canvasProps: { width: string, height: string };
    onMouseDrag?: () => void | undefined;
    onMouseDragFinish?: () => void | undefined;
    onZoom?: () => void | undefined;
};

class CanvasContainer extends React.Component<CanvasContainerProps> {

    canvasRef: RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | undefined | null;
    canvasData: ImageData | undefined;

    offset = { x: 201, y: 200 };
    offsetCentered = { x: 0, y: 0 };
    center = { x: 0, y: 0 };
    dragActive = false;
    zoom = 100;
    ZOOM_STEP = 1.5;

    constructor(props: CanvasContainerProps) {

        super(props);
        this.canvasRef = React.createRef();
        
        this.center.x = Number(this.props.canvasProps.width) / 2;
        this.center.y = Number(this.props.canvasProps.height) / 2;

        this.determineOffset();
    }

    componentDidMount(): void {

        const canvas = this.canvasRef.current;

        if (!!canvas) {
            this.ctx = canvas.getContext('2d');
            this.canvasData = this.ctx?.getImageData(0, 0, Number(this.props.canvasProps.width), Number(this.props.canvasProps.height));
        }
    }

    clearCanvas(): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawText(x: number, y: number, text: string | undefined): void {

        if (!this.ctx || !text) {
            return;
        }

        this.ctx.font = '32px serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(text, x, y);
    }

    drawTextLines(x: number, y: number, ...textLines: string[]): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.font = '32px serif';
        this.ctx.fillStyle = '#ffffff';

        textLines.forEach((text, index) => {
            this.ctx?.fillText(text, x, y + index * 40);
        });
    }

    drawLineInit(x: number, y: number): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    drawLineTransformedInit(x: number, y: number): void {

        this.drawLineInit(this.transformX(x), this.transformY(y));
    }

    drawLine(x: number, y: number): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.lineTo(x, y);
    }

    drawLineTransformed(x: number, y: number): void {

        this.drawLine(this.transformX(x), this.transformY(y));
    }

    drawLineFinish(): void {

        if (!this.ctx) {
            return;
        }

        this.ctx.stroke();
    }

    // see https://stackoverflow.com/questions/7812514/drawing-a-dot-on-html5-canvas
    drawPixel(x: number, y: number, r: number, g: number, b: number): void {

        if (!this.canvasData) {
            return;
        }

        const index = (x + y * Number(this.props.canvasProps.width)) * 4;

        this.canvasData.data[index] = r;
        this.canvasData.data[index + 1] = g;
        this.canvasData.data[index + 2] = b;
        this.canvasData.data[index + 3] = 255;
    }

    drawPixelsFinish(): void {
        
        if (!this.canvasData) {
            return;
        }

        this.ctx?.putImageData(this.canvasData, 0, 0);
    }

    determineOffset(movementX = 0, movementY = 0): void {

        this.offset = {
            x: this.offset.x + movementX / this.zoom,
            y: this.offset.y + movementY / this.zoom,
        };

        this.offsetCentered = {
            x: (this.offset.x - this.center.x) * this.zoom + this.center.x,
            y: (this.offset.y - this.center.y) * this.zoom + this.center.y,
        };
    }

    getCoordByCanvasCoord(canvasX: number, canvasY: number): { x: number, y: number } {

        return {
            x: (canvasX - this.offsetCentered.x) / this.zoom,
            y: (canvasY - this.offsetCentered.y) / this.zoom,
        };
    }

    transformX(x: number): number {
        return x * this.zoom + this.offsetCentered.x;
    };

    transformY(y: number): number {
        return y * this.zoom + this.offsetCentered.y;
    };

    mouseDown(): void {
        this.dragActive = true;
    }

    mouseUp(): void {
        this.dragActive = false;

        if (!this.props?.onMouseDragFinish) {
            return;
        }

        this.props.onMouseDragFinish();
    }

    mouseMove($event: React.MouseEvent): void {

        if (!this.dragActive) {
            return;
        }

        if (!this.props?.onMouseDrag) {
            return;
        }

        this.determineOffset($event.movementX, $event.movementY);

        this.props.onMouseDrag();
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
