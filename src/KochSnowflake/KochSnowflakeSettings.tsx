import React from 'react';
import {
    Field,
    InjectedFormProps,
    reduxForm,
    SubmitHandler,
} from 'redux-form';

class KochSnowflakeSettings extends React.Component<InjectedFormProps> {

    handleSubmit: SubmitHandler;

    constructor(props: InjectedFormProps) {
        super(props);

        this.handleSubmit = this.props.handleSubmit;
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label htmlFor="firstname">Vorname</label>
                    <Field name="firstname" component="input" type="text" />
                    <button type="submit">Submit</button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'kochSettings',
})(KochSnowflakeSettings);
