import React from 'react';

import measureTime from '../Utils/measureTime';
import DrawKochSnowflake from './DrawKochSnowflake';

type KochSnowflakeProps = {};

class KochSnowflake extends React.Component<KochSnowflakeProps> {

    elementaryRule: string[] = [ 'L', 'R', 'L' ];
    stepCount = 6;
    calculationType: 'recursive' | 'iterative' = 'recursive';

    rule: string[] = [];

    recursionCount = 0;
    iterationCount = 0;
    joinCount = 0;
    calculationTime = 0;

    constructor(props: KochSnowflakeProps) {
        super(props);
        this.calculate();
    }

    calculate() {

        // NOTE stack size exceeds with stepCount = 9 (at least on my computer) !
        if (this.stepCount > 8) {
            return;
        }

        if (this.calculationType === 'recursive') {

            this.calculationTime = measureTime(() => {
                this.rule = this.determineRuleRecursive([ 'R', 'R' ], 0);
            });

        } else if (this.calculationType === 'iterative') {

            this.calculationTime = measureTime(() => {
                this.rule = this.determineRuleIterative([ 'R', 'R' ]);
            });
        }

        this.rule.unshift('init');       // first line
    }

    determineRuleRecursive(rule: string[], stepIndex: number): string[] {

        if (stepIndex >= this.stepCount) {
            return rule;
        }

        this.recursionCount++;

        const nextRulePart = this.determineRuleRecursive(this.elementaryRule, ++stepIndex);

        let nextRule = [];
        rule.forEach((element) => {

            this.joinCount++;

            nextRule.push(...nextRulePart);
            nextRule.push(element);
        });

        this.joinCount++;
        nextRule.push(...nextRulePart);

        return nextRule;
    }

    determineRuleIterative(rule: string[]): string[] {

        let currentRule = rule;

        for (let stepIndex = 0; stepIndex < this.stepCount; stepIndex++) {

            this.iterationCount++;
            let joinCountPart = 0

            const nextRule = [];

            currentRule.forEach((element) => {

                joinCountPart++;

                nextRule.push(...this.elementaryRule);
                nextRule.push(element);
            });

            this.joinCount += joinCountPart;

            this.joinCount++;
            nextRule.push(...this.elementaryRule);

            currentRule = nextRule;
        }

        return currentRule;
    }

    render() {

        return (
            <DrawKochSnowflake
                canvasProps={{ width: '1000', height: '800' }}
                stepCount={this.stepCount}
                calculationType={this.calculationType}
                recursionCount={this.recursionCount}
                iterationCount={this.iterationCount}
                calculationTime={this.calculationTime}
                joinCount={this.joinCount}
                rule={this.rule}
            />
        );
    }
}

export default KochSnowflake;
