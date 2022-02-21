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
import { angleRadToDeg } from '../Utils/angleUtils';
import { MAX_STEPS } from './KochSnowflake';

type KochSnowflakeSettingsProps = {
    preset: string;
    stepCount: number;
    anglePlus: number;
    angleMinus: number;
};

class KochSnowflakeSettings extends React.Component<InjectedFormProps & KochSnowflakeSettingsProps> {

    componentWillMount(): void {
        this.setPreset();
    }

    componentDidUpdate(prevProps: InjectedFormProps & KochSnowflakeSettingsProps): void {

        if (prevProps.preset !== this.props.preset) {
            this.setPreset();
        }
    }

    setPreset(): void {

        let initalValues = {};

        switch (this.props.preset) {

            case 'sierpinski':
                initalValues = {
                    preset: 'sierpinski',
                    stepCount: 4,
                    startWord: '+A-A-B',
                    ruleA: 'AA',
                    ruleB: 'B-A++B++A-B',
                    anglePlus: angleRadToDeg(Math.PI / 3.0),
                    angleMinus: angleRadToDeg(-2.0 * Math.PI / 3.0),
                    offsetX: 200,
                    offsetY: 600,
                };
                break;

            case 'dragon':
                initalValues = {
                    preset: 'dragon',
                    stepCount: 4,
                    startWord: 'A',
                    ruleA: '+A--B+',
                    ruleB: '-A++B-',
                    anglePlus: angleRadToDeg(Math.PI / 4.0),
                    angleMinus: angleRadToDeg(-Math.PI / 4.0),
                    offsetX: 200,
                    offsetY: 600,
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
                    anglePlus: angleRadToDeg(Math.PI / 3.0),
                    angleMinus: angleRadToDeg(-2.0 * Math.PI / 3.0),
                    offsetX: 200,
                    offsetY: 220,
                };
                break;
        }

        this.props.initialize(initalValues);
    }

    increaseStepCount(): void {

        if (this.props.stepCount >= MAX_STEPS) {
            return;
        }

        this.props.change('stepCount', this.props.stepCount + 1);
    }

    decreaseStepCount(): void {

        if (this.props.stepCount <= 0) {
            return;
        }

        this.props.change('stepCount', this.props.stepCount - 1);
    }

    increaseAnglePlus(): void {

        this.props.change('anglePlus', this.props.anglePlus + 1);
    }

    decreaseAnglePlus(): void {

        this.props.change('anglePlus', this.props.anglePlus - 1);
    }

    increaseAngleMinus(): void {

        this.props.change('angleMinus', this.props.angleMinus + 1);
    }

    decreaseAngleMinus(): void {

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
                            <option value="dragon">Drachen-Kurve</option>
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

                        <label htmlFor="offsetX">Offset X (not working yet !)</label>
                        <Field className='settings__input' name="offsetX" component="input" type="text" />

                        <label htmlFor="offsetY">Offset Y (not working yet !)</label>
                        <Field className='settings__input' name="offsetY" component="input" type="text" />

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
