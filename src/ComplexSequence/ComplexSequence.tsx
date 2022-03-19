import './ComplexSequence.css';

import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { setComplexSequenceSettings } from '../Store/complexSequenceSettingsActions';
import { RootState } from '../Store/rootReducer';
import ComplexSequenceSettings from './ComplexSequenceSettings';
import DrawComplexSequence from './DrawComplexSequence';

type ComplexSequenceProps = {
    iterationMax: number;
};

export const MAX_STEPS = 16;

class ComplexSequence extends React.Component<ComplexSequenceProps> {

    submit(values: any) {

        (this.props as unknown as DispatchProp).dispatch(setComplexSequenceSettings({
            iterationMax: Number(values.iterationMax),
        }));
    }

    render() {

        return (
            <div className='koch-snowflake'>
                <ComplexSequenceSettings onSubmit={this.submit.bind(this)}/>
                <DrawComplexSequence
                    canvasProps={{ width: '800', height: '600' }}
                    iterationMax={this.props.iterationMax}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        iterationMax: state.complexSequenceSettings.iterationMax,
    };
}

// NOTE or define dispatch functions on props
// see https://react-redux.js.org/using-react-redux/connect-mapdispatch
export default connect(mapStateToProps)(ComplexSequence);
