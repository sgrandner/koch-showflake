import './ComplexSequenceSettings.css';

import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector, InjectedFormProps, reduxForm } from 'redux-form';

import FormFieldChanger from '../Form/FieldWithChanger';
import { RootState } from '../Store/rootReducer';

type ComplexSequenceSettingsProps = {
    iterationMax: number;
};

class ComplexSequenceSettings extends React.Component<InjectedFormProps & ComplexSequenceSettingsProps> {

    componentWillMount(): void {
        this.setPreset();
    }

    setPreset(): void {

        let initalValues = {
            iterationMax: 100,
        };

        this.props.initialize(initalValues);
    }

    increaseIterationMax(): void {

        this.props.change('iterationMax', this.props.iterationMax + 1);
    }

    decreaseIterationMax(): void {

        this.props.change('iterationMax', this.props.iterationMax - 1);
    }

    render() {
        return (
            <>
                <form onSubmit={this.props.handleSubmit}>
                    <div className='settings'>

                        <FormFieldChanger
                            name='iterationMax'
                            label='Max. Iterationen'
                            onIncrease={this.increaseIterationMax.bind(this)}
                            onDecrease={this.decreaseIterationMax.bind(this)}
                        />

                        <button type="submit">Berechnen & Zeichnen</button>
                    </div>
                </form>
            </>
        );
    }
}

// NOTE decorate class component ComplexSequenceSettings with connect method
//      connects redux store with props of component in order to read store values
const mapStateToProps = (state: RootState) => {
    const selector = formValueSelector('complexSequenceSettings');
    const iterationMax = Number(selector(state, 'iterationMax'));
    return {
        iterationMax,
    };
};
const ComplexSequenceSettingsConnected = connect(mapStateToProps)(ComplexSequenceSettings);

// NOTE decorate ComplexSequenceSettingsConnected with reduxform
//      connects form with redux store
export default reduxForm({
    form: 'complexSequenceSettings',
})(ComplexSequenceSettingsConnected);
