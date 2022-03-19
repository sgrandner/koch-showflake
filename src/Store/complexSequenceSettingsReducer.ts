import { AnyAction } from 'redux';

import { setComplexSequenceSettings } from './complexSequenceSettingsActions';

export type ComplexSequenceSettingsState = {
    iterationMax: number;
};

const initialState: ComplexSequenceSettingsState = {
    iterationMax: 0,
};

const complexSequenceSettingsReducer = (state = initialState, action: AnyAction): ComplexSequenceSettingsState => {

    switch (action.type) {
        // TODO payload not typed
        case setComplexSequenceSettings.type:
            return {
                ...state,
                iterationMax: action.payload.iterationMax,
            };
        default:
            return state;
    }
};

export default complexSequenceSettingsReducer;
