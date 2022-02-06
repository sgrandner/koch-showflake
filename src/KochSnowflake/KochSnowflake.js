import React from "react";
import DrawKochSnowflake from "./DrawKochSnowflake";
import measureTime from "../Utils/measureTime";

class KochSnowflake extends React.Component {

    elementaryRule = [ 'L', 'R', 'L' ];
    stepCount = 6;
    calculationType = 'recursive';    // 'recursive' | 'iterative'

    rule = [];

    recursionCount = 0;
    iterationCount = 0;
    joinCount = 0;
    calculationTime = 0;

    constructor(props) {
        super(props);
        this.calculate();
    }

    calculate() {

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

    determineRuleRecursive(rule, stepIndex) {

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

    determineRuleIterative(rule) {

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
                width='500'
                height='400'
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
