import React from 'react';
import {
    connect,
    DispatchProp,
} from 'react-redux';

import { RootState } from '../Store/rootReducer';
import { setKochSnowflakeSettings } from '../Store/settingsActions';
import { angleDegToRad } from '../Utils/angleUtils';
import measureTime from '../Utils/measureTime';
import DrawKochSnowflake from './DrawKochSnowflake';
import KochSnowflakeSettings from './KochSnowflakeSettings';

type KochSnowflakeProps = {
    stepCount: number;
    startWord: string;
    ruleA: string;
    ruleB: string;
};

export const MAX_STEPS = 13;

class KochSnowflake extends React.Component<KochSnowflakeProps> {

    calculationType: 'recursive' | 'iterative' = 'recursive';

    resultRule: string = '';

    // NOTE result rules for step 0 and 1 for calculation of growth factor in draw component
    resultRule0: string = '';
    resultRule1: string = '';

    recursionCount = 0;
    iterationCount = 0;
    joinCount = 0;
    calculationTime = 0;

    calculate() {

        this.recursionCount = 0;
        this.iterationCount = 0;
        this.joinCount = 0;
        this.calculationTime = 0;

        if (!(this.props.stepCount >= 0 && this.props.stepCount < MAX_STEPS)) {
            return;
        }

        if (this.calculationType === 'recursive') {

            // TODO what about B, maybe 'AB' ?
            this.resultRule0 = this.determineRuleRecursive('A', 0, 0);
            this.resultRule1 = this.determineRuleRecursive('A', 1, 0);

            this.calculationTime = measureTime(() => {
                this.resultRule = this.determineRuleRecursive(this.props.startWord || '', this.props.stepCount, 0);
            });

        } else if (this.calculationType === 'iterative') {

            // TODO what about B, maybe 'AB' ?
            this.resultRule0 = this.determineRuleIterative('A', 0);
            this.resultRule1 = this.determineRuleIterative('A', 1);

            this.calculationTime = measureTime(() => {
                this.resultRule = this.determineRuleIterative(this.props.startWord || '', this.props.stepCount);
            });
        }
    }

    determineRuleRecursive(resultRule: string, stepCount: number, stepIndex: number): string {

        if (stepIndex >= stepCount) {
            return resultRule;
        }

        this.recursionCount++;

        stepIndex++;
        const nextRulePartA = this.determineRuleRecursive(this.props.ruleA, stepCount, stepIndex);
        const nextRulePartB = this.determineRuleRecursive(this.props.ruleB, stepCount, stepIndex);

        let nextRule = '';
        for (let i = 0; i < resultRule.length; i++) {

            const element = resultRule.charAt(i);

            switch (element) {
                case 'A':
                    nextRule = nextRule.concat(nextRulePartA);
                    break;
                case 'B':
                    nextRule = nextRule.concat(nextRulePartB);
                    break;
                default:
                    nextRule = nextRule.concat(element);
                    break;
            }

            this.joinCount++;
        }

        return nextRule;
    }

    determineRuleIterative(resultRule: string, stepCount: number): string {

        let currentRule = resultRule;

        for (let stepIndex = 0; stepIndex < stepCount; stepIndex++) {

            this.iterationCount++;
            let joinCountPart = 0

            let nextRule = '';

            for (let i = 0; i < currentRule.length; i++) {

                const element = currentRule.charAt(i);

                switch (element) {
                    case 'A':
                        nextRule = nextRule.concat(this.props.ruleA);
                        break;
                    case 'B':
                        nextRule = nextRule.concat(this.props.ruleB);
                        break;
                    default:
                        nextRule = nextRule.concat(element);
                        break;
                }

                joinCountPart++;
            }

            this.joinCount += joinCountPart;

            currentRule = nextRule;
        }

        return currentRule;
    }

    submit(values: any) {

        (this.props as unknown as DispatchProp).dispatch(setKochSnowflakeSettings({
            stepCount: Number(values.stepCount),
            startWord: values.startWord,
            ruleA: values.ruleA,
            ruleB: values.ruleB,
            anglePlus: angleDegToRad(Number(values.anglePlus)),
            angleMinus: angleDegToRad(Number(values.angleMinus)),
            offsetX: Number(values.offsetX),
            offsetY: Number(values.offsetY),
        }));
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
                    resultRule={this.resultRule}
                    resultRule0={this.resultRule0}
                    resultRule1={this.resultRule1}
                    recursionCount={this.recursionCount}
                    iterationCount={this.iterationCount}
                    calculationTime={this.calculationTime}
                    joinCount={this.joinCount}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        stepCount: state.settings.stepCount,
        startWord: state.settings.startWord,
        ruleA: state.settings.ruleA,
        ruleB: state.settings.ruleB,
    };
}

// NOTE or define dispatch functions on props
// see https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect(mapStateToProps)(KochSnowflake);
