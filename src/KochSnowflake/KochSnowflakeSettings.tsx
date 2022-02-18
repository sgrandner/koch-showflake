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
        this.props.initialize({
            stepCount: 4,
            startWord: 'A-A-A',
            elementaryRule: 'A+A-A+A',
            anglePlus: Math.round(Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
            angleMinus: Math.round(-2.0 * Math.PI / 3.0 * RAD_TO_DEG * 100) / 100,
        });
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

                        <label htmlFor="elementaryRule">Regel</label>
                        <Field className='settings__input' name="elementaryRule" component="input" type="text" />

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
