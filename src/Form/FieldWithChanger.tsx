import './FieldWithChanger.css';

import React from 'react';
import { Field } from 'redux-form';

type FormFieldChangerProps = {
    name: string;
    label: string;
    onIncrease: () => void | undefined;
    onDecrease: () => void | undefined;
};

class FormFieldChanger extends React.Component<FormFieldChangerProps> {

    render() {
        return (
            <>
                <label htmlFor={this.props.name}>{this.props.label}</label>

                <div className='field-with-changer'>
                    <Field name={this.props.name} component="input" type="text" />

                    <div className='changer'>
                        <button className='changer__button' onClick={this.props.onIncrease}>+</button>
                        <button className='changer__button' onClick={this.props.onDecrease}>-</button>
                    </div>
                </div>
            </>
        );
    }
}

export default FormFieldChanger;
