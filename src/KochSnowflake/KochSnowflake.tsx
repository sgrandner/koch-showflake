import React from 'react';
import {
    connect,
    DispatchProp,
} from 'react-redux';

import { RootState } from '../Store/rootReducer';
import { setKochSnowflakeSettings } from '../Store/settingsActions';
import measureTime from '../Utils/measureTime';
import DrawKochSnowflake from './DrawKochSnowflake';
import KochSnowflakeSettings, { RAD_TO_DEG } from './KochSnowflakeSettings';

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

    recursionCount = 0;
    iterationCount = 0;
    joinCount = 0;
    calculationTime = 0;

    calculate() {

        if (!(this.props.stepCount >= 0 && this.props.stepCount < MAX_STEPS)) {
            return;
        }

        if (this.calculationType === 'recursive') {

            this.calculationTime = measureTime(() => {
                this.resultRule = this.determineRuleRecursive(this.props.startWord || '', 0);
            });

        } else if (this.calculationType === 'iterative') {

            this.calculationTime = measureTime(() => {
                this.resultRule = this.determineRuleIterative(this.props.startWord || '');
            });
        }
    }

    determineRuleRecursive(resultRule: string, stepIndex: number): string {

        if (stepIndex >= this.props.stepCount) {
            return resultRule;
        }

        this.recursionCount++;

        stepIndex++;
        const nextRulePartA = this.determineRuleRecursive(this.props.ruleA, stepIndex);
        const nextRulePartB = this.determineRuleRecursive(this.props.ruleB, stepIndex);

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

    determineRuleIterative(resultRule: string): string {

        let currentRule = resultRule;

        for (let stepIndex = 0; stepIndex < this.props.stepCount; stepIndex++) {

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
            anglePlus: Number(values.anglePlus) / RAD_TO_DEG,
            angleMinus: Number(values.angleMinus) / RAD_TO_DEG,
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
