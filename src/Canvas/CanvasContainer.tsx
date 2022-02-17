import './CanvasContainer.css';

import React, { RefObject } from 'react';

type CanvasContainerProps = {
    canvasProps: { width: string, height: string };
    onMouseDrag?: (drag: { x: number, y: number }) => void | undefined;
    onMouseDragFinish?: () => void | undefined;
};

class CanvasContainer extends React.Component<CanvasContainerProps> {

    canvasRef: RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | undefined | null;

    dragActive = false;

    constructor(props: CanvasContainerProps) {

        super(props);
        this.canvasRef = React.createRef();
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

        this.props.onMouseDrag({
            x: $event?.movementX,
            y: $event?.movementY,
        });
    }

    render() {
        return <canvas
            ref={this.canvasRef}
            {...this.props.canvasProps}
            onMouseDown={this.mouseDown.bind(this)}
            onMouseUp={this.mouseUp.bind(this)}
            onMouseMove={this.mouseMove.bind(this)}
        />;
    }
}

export default CanvasContainer;
