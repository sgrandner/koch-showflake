import React from 'react';
import {
    connect,
    DispatchProp,
} from 'react-redux';

import { RootState } from '../Store/rootReducer';
import { setStepCount } from '../Store/settingsActions';
import measureTime from '../Utils/measureTime';
import DrawKochSnowflake from './DrawKochSnowflake';
import KochSnowflakeSettings from './KochSnowflakeSettings';

type KochSnowflakeProps = {
    stepCount: number;
};

class KochSnowflake extends React.Component<KochSnowflakeProps> {

    elementaryRule: string[] = [ 'L', 'R', 'L' ];
    calculationType: 'recursive' | 'iterative' = 'recursive';

    rule: string[] = [];

    recursionCount = 0;
    iterationCount = 0;
    joinCount = 0;
    calculationTime = 0;

    calculate() {

        // NOTE stack size exceeds with stepCount = 9 (at least on my computer) !
        if (this.props.stepCount > 8) {
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

        if (stepIndex >= this.props.stepCount) {
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

        for (let stepIndex = 0; stepIndex < this.props.stepCount; stepIndex++) {

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

    submit(values: any) {

        (this.props as unknown as DispatchProp).dispatch(setStepCount({ steps: Number(values.stepCount) }));
    }

    render() {

        this.calculate();

        return (
            <div>
                <KochSnowflakeSettings onSubmit={this.submit.bind(this)}/>
                <DrawKochSnowflake
                    canvasProps={{ width: '1000', height: '800' }}
                    stepCount={this.props.stepCount}
                    calculationType={this.calculationType}
                    recursionCount={this.recursionCount}
                    iterationCount={this.iterationCount}
                    calculationTime={this.calculationTime}
                    joinCount={this.joinCount}
                    rule={this.rule}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        stepCount: state.settings.stepCount,
    };
}

// NOTE or define dispatch functions on props
// see https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect(mapStateToProps)(KochSnowflake);
