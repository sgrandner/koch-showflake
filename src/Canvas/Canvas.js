import './Canvas.css';
import { useEffect, useRef } from "react";

const Canvas = props => {

    const canvasRef = useRef(null);

    const draw = ctx => {

        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(200, 200);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        ctx.stroke();
    };

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        draw(context);
    });
    // TODO draw method in depencyList (2nd argument ?!)

    return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
