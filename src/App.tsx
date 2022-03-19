import './App.css';

import React, { useReducer } from 'react';

import ComplexSequence from './ComplexSequence/ComplexSequence';
import KochSnowflake from './KochSnowflake/KochSnowflake';

const navigationConfig = [
    {
        name: 'fractalCurves',
        label: 'Fraktale Kurven',
    },
    {
        name: 'complexSequences',
        label: 'Komplexe Folgen',
    },
];

type State = {
    activeNavigation: string;
};

const initialState: State = {
    activeNavigation: '',
};

function App() {

    // TODO type of action ?
    const reducer = (state: State, action: any): State => {
        switch (action.type) {
            case 'setFeature':
                return {
                    ...state,
                    activeNavigation: action.payload.navigationName,
                };
        
            default:
                return {
                    ...state,
                };
        }
    };

    const setFeature = (navigationName: string) => ({ type: 'setFeature', payload: { navigationName } });

    const [ state, dispatch ] = useReducer(reducer, initialState);
    
    return (
        <div className='app'>
            <div className='navigation'>
                {
                    navigationConfig.map((config) => {
                        return (
                            <div className='navigation__entry' onClick={() => dispatch(setFeature(config.name))}>
                                {config.label}
                            </div>
                        )
                    })
                }
            </div>

            {state.activeNavigation === 'fractalCurves' &&
                <KochSnowflake />
            }
            {state.activeNavigation === 'complexSequences' &&
                <ComplexSequence />
            }
        </div>
    );
}

export default App;
