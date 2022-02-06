import React from 'react';
import './CanvasContainer.css';

class CanvasContainer extends React.Component {

    ctx;

    constructor(props) {
        super(props);
        this.canvasProps = props.canvasProps;

        this.canvasRef = React.createRef();
    }

    componentDidMount() {

        const canvas = this.canvasRef.current;
        this.ctx = canvas.getContext('2d');
    }

    clearCanvas() {

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawText(x, y, text) {

        this.ctx.font = '32px serif';
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(text, x, y);
    }

    drawTextLines(x, y, ...textLines) {

        this.ctx.font = '32px serif';
        this.ctx.fillStyle = '#000000';

        textLines.forEach((text, index) => {
            this.ctx.fillText(text, x, y + index * 40);
        });
    }

    drawLineInit(x, y) {

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    drawLine(x, y) {

        this.ctx.lineTo(x, y);
    }

    drawLineFinish() {

        this.ctx.stroke();
    }

    render() {
        return <canvas ref={this.canvasRef} {...this.canvasProps} />;
    }
}

export default CanvasContainer;
