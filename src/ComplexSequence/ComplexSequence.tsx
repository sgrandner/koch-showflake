import './ComplexSequence.css';

import React from 'react';

import DrawComplexSequence from './DrawComplexSequence';

type ComplexSequenceProps = {
};

export const MAX_STEPS = 16;

class ComplexSequence extends React.Component<ComplexSequenceProps> {

    render() {

        return (
            <div className='koch-snowflake'>
                <DrawComplexSequence
                    canvasProps={{ width: '600', height: '600' }}
                />
            </div>
        );
    }
}

// const mapStateToProps = (state: RootState) => {
//     return {
//     };
// }

// NOTE or define dispatch functions on props
// see https://react-redux.js.org/using-react-redux/connect-mapdispatch
// export default connect(mapStateToProps)(ComplexSequence);
export default ComplexSequence;
