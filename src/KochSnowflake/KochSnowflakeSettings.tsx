import './KochSnowflakeSettings.css';

import React from 'react';
import { connect } from 'react-redux';
import {
    Field,
    formValueSelector,
    InjectedFormProps,
    reduxForm,
} from 'redux-form';

import { MAX_STEPS } from './KochSnowflake';

export const RAD_TO_DEG = 180.0 / Math.PI;

type KochSnowflakeSettingsProps = {
    stepCount: number;
    anglePlus: number;
    angleMinus: number;
};

class KochSnowflakeSettings extends React.Component<InjectedFormProps & KochSnowflakeSettingsProps> {

    componentWillMount() {
        // TODO preset selector
        // preset Koch snowflake
        this.props.initialize({
            stepCount: 4,
            startWord: 'A-A-A',
            ruleA: 'A+A-A+A',
            ruleB: '',
            anglePlus: Math.round(Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
            angleMinus: Math.round(-2.0 * Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
        });
        // preset Sierpinski triangle
        // this.props.initialize({
        //     stepCount: 4,
        //     startWord: '+A-A-B',
        //     ruleA: 'AA',
        //     ruleB: 'B-A++B++A-B',
        //     anglePlus: Math.round(Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
        //     angleMinus: Math.round(-2.0 * Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
        // });
    }

    increaseStepCount() {

        if (this.props.stepCount >= MAX_STEPS) {
            return;
        }

        this.props.change('stepCount', this.props.stepCount + 1);
    }

    decreaseStepCount() {

        if (this.props.stepCount <= 0) {
            return;
        }

        this.props.change('stepCount', this.props.stepCount - 1);
    }

    increaseAnglePlus() {

        this.props.change('anglePlus', this.props.anglePlus + 1);
    }

    decreaseAnglePlus() {

        this.props.change('anglePlus', this.props.anglePlus - 1);
    }

    increaseAngleMinus() {

        this.props.change('angleMinus', this.props.angleMinus + 1);
    }

    decreaseAngleMinus() {

        this.props.change('angleMinus', this.props.angleMinus - 1);
    }

    render() {
        return (
            <>
                <form onSubmit={this.props.handleSubmit}>
                    <div className='settings'>
                        <label htmlFor="stepCount">Schritte</label>
                        <Field className='settings__input' name="stepCount" component="input" type="text" />
                        <button onClick={this.increaseStepCount.bind(this)}>+</button>
                        <button onClick={this.decreaseStepCount.bind(this)}>-</button>

                        <label htmlFor="startWord">Startwort</label>
                        <Field className='settings__input' name="startWord" component="input" type="text" />

                        <label htmlFor="ruleA">Regel A</label>
                        <Field className='settings__input' name="ruleA" component="input" type="text" />

                        <label htmlFor="ruleA">Regel B</label>
                        <Field className='settings__input' name="ruleB" component="input" type="text" />

                        <label htmlFor="anglePlus">Winkel +</label>
                        <Field className='settings__input' name="anglePlus" component="input" type="text" />
                        <button onClick={this.increaseAnglePlus.bind(this)}>+</button>
                        <button onClick={this.decreaseAnglePlus.bind(this)}>-</button>

                        <label htmlFor="angleMinus">Winkel -</label>
                        <Field className='settings__input' name="angleMinus" component="input" type="text" />
                        <button onClick={this.increaseAngleMinus.bind(this)}>+</button>
                        <button onClick={this.decreaseAngleMinus.bind(this)}>-</button>

                        <button type="submit">Submit</button>
                    </div>
                </form>
            </>
        );
    }
}

// NOTE decorate class component KochSnowflakeSettings with connect method
//      connects redux store with props of component in order to read store values
const mapStateToProps = (state: any) => {
    const selector = formValueSelector('kochSettings');
    const stepCount = Number(selector(state, 'stepCount'));
    const anglePlus = Number(selector(state, 'anglePlus'));
    const angleMinus = Number(selector(state, 'angleMinus'));
    return {
        stepCount,
        anglePlus,
        angleMinus,
    };
};
const KochSnowflakeSettingsConnected = connect(mapStateToProps)(KochSnowflakeSettings);

// NOTE decorate KochSnowflakeSettingsConnected with reduxform
//      connects form with redux store
export default reduxForm({
    form: 'kochSettings',
})(KochSnowflakeSettingsConnected);;
