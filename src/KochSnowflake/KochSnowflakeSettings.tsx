import './KochSnowflakeSettings.css';

import React from 'react';
import {
    Field,
    InjectedFormProps,
    reduxForm,
} from 'redux-form';

export const RAD_TO_DEG = 180.0 / Math.PI;

class KochSnowflakeSettings extends React.Component<InjectedFormProps> {

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

    render() {
        return (
            <>
                <form onSubmit={this.props.handleSubmit}>
                    <div className='settings'>
                        <label htmlFor="stepCount">Schritte</label>
                        <Field className='settings__input' name="stepCount" component="input" type="text" />

                        <label htmlFor="startWord">Startwort</label>
                        <Field className='settings__input' name="startWord" component="input" type="text" />

                        <label htmlFor="ruleA">Regel A</label>
                        <Field className='settings__input' name="ruleA" component="input" type="text" />

                        <label htmlFor="ruleA">Regel B</label>
                        <Field className='settings__input' name="ruleB" component="input" type="text" />

                        <label htmlFor="anglePlus">Winkel +</label>
                        <Field className='settings__input' name="anglePlus" component="input" type="text" />

                        <label htmlFor="angleMinus">Winkel -</label>
                        <Field className='settings__input' name="angleMinus" component="input" type="text" />

                        <button type="submit">Submit</button>
                    </div>
                </form>
            </>
        );
    }
}

export default reduxForm({
    form: 'kochSettings',
})(KochSnowflakeSettings);
