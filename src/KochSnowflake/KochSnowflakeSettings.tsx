import React from 'react';
import {
    Field,
    InjectedFormProps,
    reduxForm,
} from 'redux-form';

class KochSnowflakeSettings extends React.Component<InjectedFormProps> {

    render() {
        return (
            <>
                <form onSubmit={this.props.handleSubmit}>
                    <div>
                        <label htmlFor="stepCount">Schritte</label>
                        <Field name="stepCount" component="input" type="text" />
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
