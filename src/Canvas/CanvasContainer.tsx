import './CanvasContainer.css';

import React, { RefObject } from 'react';

enum Zoom {
    IN,
    OUT,
}

type CanvasContainerProps = {
    canvasProps: { width: string, height: string };
    onMouseDrag?: (canvasOffset: { x: number, y: number }) => void | undefined;
    onMouseDragFinish?: () => void | undefined;
    onZoom?: (zoom: number) => void | undefined;
};

class CanvasContainer extends React.Component<CanvasContainerProps> {

    canvasRef: RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | undefined | null;

    offset = { x: 600, y: 600 };
    center = { x: 0, y: 0 };
    dragActive = false;
    zoom = 1;
    ZOOM_STEP = 1.5;

    constructor(props: CanvasContainerProps) {

        super(props);
        this.canvasRef = React.createRef();
        
        this.center.x = Number(this.props.canvasProps.width) / 2;
        this.center.y = Number(this.props.canvasProps.height) / 2;
    }

    componentDidMount() {

        const canvas = this.canvasRef.current;

        if (!!canvas) {
            this.ctx = canvas.getContext('2d');
        }
    }

    clearCanvas() {

        if (!this.ctx) {
            return;
        }

        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawText(x: number, y: number, text: string | undefined) {

        if (!this.ctx || !text) {
            return;
        }

        this.ctx.font = '32px serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(text, x, y);
    }

    drawTextLines(x: number, y: number, ...textLines: string[]) {

        if (!this.ctx) {
            return;
        }

        this.ctx.font = '32px serif';
        this.ctx.fillStyle = '#ffffff';

        textLines.forEach((text, index) => {
            this.ctx?.fillText(text, x, y + index * 40);
        });
    }

    drawLineInit(x: number, y: number) {

        if (!this.ctx) {
            return;
        }

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    drawLine(x: number, y: number) {

        if (!this.ctx) {
            return;
        }

        this.ctx.lineTo(x, y);
    }

    drawLineFinish() {

        if (!this.ctx) {
            return;
        }

        this.ctx.stroke();
    }

    mouseDown() {
        this.dragActive = true;
    }

    mouseUp() {
        this.dragActive = false;

        if (!this.props?.onMouseDragFinish) {
            return;
        }

        this.props.onMouseDragFinish();
    }

    mouseMove($event: React.MouseEvent) {

        if (!this.dragActive) {
            return;
        }

        if (!this.props?.onMouseDrag) {
            return;
        }

        this.offset = {
            x: this.offset.x + $event?.movementX / this.zoom,
            y: this.offset.y + $event?.movementY / this.zoom,
        };

        const canvasOffset = {
            x: (this.offset.x - this.center.x) * this.zoom + this.center.x,
            y: (this.offset.y - this.center.y) * this.zoom + this.center.y,
        };

        this.props.onMouseDrag(canvasOffset);
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

        this.props.onZoom(this.zoom || 1.0);
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
