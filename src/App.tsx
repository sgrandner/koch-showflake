import './App.css';

import React from 'react';

import ComplexSequence from './ComplexSequence/ComplexSequence';
import KochSnowflake from './KochSnowflake/KochSnowflake';

function App() {
    return (
        <div className='app'>
            {/* <KochSnowflake /> */}
            <ComplexSequence />
        </div>
    );
}

export default App;
