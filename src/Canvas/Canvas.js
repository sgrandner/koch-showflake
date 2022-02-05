import './Canvas.css';
import { useEffect, useRef } from "react";

const Canvas = props => {

    // https://www.section.io/engineering-education/desktop-application-with-react/
    // https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258

    const canvasRef = useRef(null);

    const clearCanvas = (ctx) => {

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    const drawText = (ctx, text, x, y) => {

        ctx.font = '16px serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x, y);
    };

    const drawLineInit = (ctx, x, y) => {

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const drawLine = (ctx, x, y) => {

        ctx.lineTo(x, y);
    };

    const drawLineFinish = (ctx) => {

        ctx.stroke();
    };

    const elementaryRule = [ 'L', 'R', 'L' ];
    const stepCount = 4;
    const calculationType = 'recursive';    // 'recursive' | 'iterative'

    let recursionCount = 0;
    let iterationCount = 0;
    let joinCount = 0;

    const determineRuleRecursive = (rule, stepIndex) => {

        if (stepIndex >= stepCount) {
            return rule;
        }

        recursionCount++;

        const nextRulePart = determineRuleRecursive(elementaryRule, ++stepIndex);

        let nextRule = [];
        rule.forEach((element) => {

            joinCount++;

            nextRule.push(...nextRulePart);
            nextRule.push(element);
        });

        joinCount++;
        nextRule.push(...nextRulePart);

        return nextRule;
    };

    const determineRuleIterative = (rule) => {

        let currentRule = rule;

        for (let stepIndex = 0; stepIndex < stepCount; stepIndex++) {

            iterationCount++;
            let joinCountPart = 0

            const nextRule = [];

            currentRule.forEach((element) => {

                joinCountPart++;

                nextRule.push(...elementaryRule);
                nextRule.push(element);
            });

            joinCount += joinCountPart;

            joinCount++;
            nextRule.push(...elementaryRule);

            currentRule = nextRule;
        }

        return currentRule;
    };

    const measureTime = (fn) => {

        const before = new Date();

        fn();

        const after = new Date();

        return after.getTime() - before.getTime();
    };

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        clearCanvas(context);

        // NOTE stack size exceeds with stepCount = 9 (at least on my computer) !
        if (stepCount > 8) {
            drawText(context, 'too many recursion steps (max. 8) !', 30, 50);
            return;
        }

        drawText(context, calculationType, 10, 20);

        let rule;
        let calculationTime = 0;
        if (calculationType === 'recursive') {

            calculationTime = measureTime(() => {
                rule = determineRuleRecursive([ 'R', 'R' ], 0);
            });

        } else if (calculationType === 'iterative') {

            calculationTime = measureTime(() => {
                rule = determineRuleIterative([ 'R', 'R' ]);
            });
        }

        rule.unshift('init');       // first line

        let x = 100;
        let y = 110;
        let length = 300 / 3**stepCount;
        let angle = 0;

        drawText(context, `${rule.length} segments`, 10, 40);
        if (calculationType === 'recursive') {
            drawText(context, `${recursionCount} recursions`, 10, 60);
        } else if (calculationType === 'iterative') {
            drawText(context, `${iterationCount} iterations`, 10, 60);
        }
        drawText(context, `${joinCount} joins`, 10, 80);
        drawText(context, `calculation time: ${calculationTime} ms`, 10, 360);

        const drawTime = measureTime(() => {

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

            drawLineFinish(context);
        });

        drawText(context, `draw time: ${drawTime} ms`, 10, 380);
    });

    return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
