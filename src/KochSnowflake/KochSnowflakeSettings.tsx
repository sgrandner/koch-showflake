import './KochSnowflakeSettings.css';

import React from 'react';
import { connect } from 'react-redux';
import {
    Field,
    formValueSelector,
    InjectedFormProps,
    reduxForm,
} from 'redux-form';

import { RootState } from '../Store/rootReducer';
import { MAX_STEPS } from './KochSnowflake';

export const RAD_TO_DEG = 180.0 / Math.PI;

type KochSnowflakeSettingsProps = {
    preset: string;
    stepCount: number;
    anglePlus: number;
    angleMinus: number;
};

class KochSnowflakeSettings extends React.Component<InjectedFormProps & KochSnowflakeSettingsProps> {

    componentWillMount() {
        this.setPreset();
    }

    componentDidUpdate(prevProps: InjectedFormProps & KochSnowflakeSettingsProps) {

        if (prevProps.preset !== this.props.preset) {
            this.setPreset();
        }
    }

    setPreset() {

        let initalValues = {};

        switch (this.props.preset) {

            case 'sierpinski':
                initalValues = {
                    preset: 'sierpinski',
                    stepCount: 4,
                    startWord: '+A-A-B',
                    ruleA: 'AA',
                    ruleB: 'B-A++B++A-B',
                    anglePlus: Math.round(Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
                    angleMinus: Math.round(-2.0 * Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
                };
                break;

            case 'koch':
            default:
                initalValues = {
                    preset: 'koch',
                    stepCount: 4,
                    startWord: 'A-A-A',
                    ruleA: 'A+A-A+A',
                    ruleB: '',
                    anglePlus: Math.round(Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
                    angleMinus: Math.round(-2.0 * Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
                };
                break;
        }

        this.props.initialize(initalValues);
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
                        <Field name="preset" component="select">
                            <option value="koch">Kochsche Schneeflocke</option>
                            <option value="sierpinski">Sierpinski Dreieck</option>
                        </Field>

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

                        <button type="submit">Berechnen & Zeichnen</button>
                    </div>
                </form>
            </>
        );
    }
}

// NOTE decorate class component KochSnowflakeSettings with connect method
//      connects redux store with props of component in order to read store values
const mapStateToProps = (state: RootState) => {
    const selector = formValueSelector('kochSettings');
    const preset = selector(state, 'preset');
    const stepCount = Number(selector(state, 'stepCount'));
    const anglePlus = Number(selector(state, 'anglePlus'));
    const angleMinus = Number(selector(state, 'angleMinus'));
    return {
        preset,
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
