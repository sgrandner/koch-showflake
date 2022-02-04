import './Canvas.css';
import { useEffect, useRef } from "react";

const Canvas = props => {

    const canvasRef = useRef(null);

    const clearCanvas = (ctx) => {

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    const drawText = (ctx, text, x, y) => {

        ctx.font = '20px serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x, y);
    };

    const drawLineInit = (ctx, x, y) => {

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const drawLine = (ctx, x, y) => {

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const ruleStep = [ 'L', 'R', 'L' ];
    const recursionSteps = 3;

    const determineRule = (step, index) => {

        if (index > recursionSteps) {
            return [];
        }

        const nextStepPart = determineRule(ruleStep, ++index);

        let nextStep = [];
        step.forEach((element) => {

            nextStep.push(...nextStepPart);
            nextStep.push(element);
        });
        nextStep.push(...nextStepPart);

        return nextStep;
    };

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        clearCanvas(context);

        if (recursionSteps > 5) {
            drawText(context, 'too many recursion steps (max. 5) !', 30, 50);
            return;
        }

        const rule = determineRule([ 'R', 'R' ], 0);
        rule.unshift('init');

        let x = 100;
        let y = 110;
        let length = 300 / 3**recursionSteps;
        let angle = 0;

        drawText(context, `${rule.length} segments`, 20, 40);

        drawLineInit(context, x, y);

        rule.forEach(element => {

            switch (element) {
                case 'L':
                    angle += Math.PI / 3.0;
                    break;
                case 'R':
                    angle -= 2.0 * Math.PI / 3.0;
                    break;
                default:
                    break;
            }

            x += Math.cos(angle) * length;
            y -= Math.sin(angle) * length;

            drawLine(context, x, y);
        });
    });
    // TODO draw method in depencyList (2nd argument ?!)

    return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
