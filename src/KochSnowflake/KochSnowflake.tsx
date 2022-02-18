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
    elementaryRule: string;
};

export const MAX_STEPS = 13;

class KochSnowflake extends React.Component<KochSnowflakeProps> {

    calculationType: 'recursive' | 'iterative' = 'recursive';

    rule: string = '';

    recursionCount = 0;
    iterationCount = 0;
    joinCount = 0;
    calculationTime = 0;

    calculate() {

        if (!(this.props.stepCount >= 0 && this.props.stepCount < MAX_STEPS)) {
            return;
        }

        if (
            this.props.startWord === null ||
            this.props.startWord === undefined ||
            !this.props.elementaryRule ||
            this.props.elementaryRule.length === 0
        ) {
            return;
        }

        if (this.calculationType === 'recursive') {

            this.calculationTime = measureTime(() => {
                this.rule = this.determineRuleRecursive(this.props.startWord, 0);
            });

        } else if (this.calculationType === 'iterative') {

            this.calculationTime = measureTime(() => {
                this.rule = this.determineRuleIterative(this.props.startWord);
            });
        }
    }

    determineRuleRecursive(rule: string, stepIndex: number): string {

        if (stepIndex >= this.props.stepCount) {
            return rule;
        }

        this.recursionCount++;

        const nextRulePart = this.determineRuleRecursive(this.props.elementaryRule, ++stepIndex);

        let nextRule = '';
        for (let i = 0; i < rule.length; i++) {

            const element = rule.charAt(i);

            if (element === 'A') {
                nextRule = nextRule.concat(nextRulePart);
            } else {
                nextRule = nextRule.concat(element);
            }

            this.joinCount++;
        }

        return nextRule;
    }

    determineRuleIterative(rule: string): string {

        let currentRule = rule;

        for (let stepIndex = 0; stepIndex < this.props.stepCount; stepIndex++) {

            this.iterationCount++;
            let joinCountPart = 0

            let nextRule = '';

            for (let i = 0; i < currentRule.length; i++) {

                const element = currentRule.charAt(i);

                if (element === 'A') {
                    nextRule = nextRule.concat(this.props.elementaryRule);
                } else {
                    nextRule = nextRule.concat(element);
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
            elementaryRule: values.elementaryRule,
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
                    rule={this.rule}
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
        elementaryRule: state.settings.elementaryRule,
    };
}

// NOTE or define dispatch functions on props
// see https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect(mapStateToProps)(KochSnowflake);
