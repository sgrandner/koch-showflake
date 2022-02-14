import { AnyAction } from 'redux';

import { setStepCount } from './settingsActions';

export type SettingsState = {
    stepCount: number;
};

const initialState: SettingsState = {
    stepCount: 1,
};

const settingsReducer = (state = initialState, action: AnyAction): SettingsState => {

    switch (action.type) {
        // TODO payload not typed
        case setStepCount.type:
            return {
                ...state,
                stepCount: action.payload.steps,
            };
        default:
            return state;
    }
};

export default settingsReducer;
