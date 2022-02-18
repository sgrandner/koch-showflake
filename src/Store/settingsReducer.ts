import { AnyAction } from 'redux';

import { setKochSnowflakeSettings } from './settingsActions';

export type SettingsState = {
    stepCount: number;
    startWord: string;
    elementaryRule: string;
    anglePlus: number;
    angleMinus: number;
};

const initialState: SettingsState = {
    stepCount: 0,
    startWord: '',
    elementaryRule: '',
    anglePlus: 0,
    angleMinus: 0,
};

const settingsReducer = (state = initialState, action: AnyAction): SettingsState => {

    switch (action.type) {
        // TODO payload not typed
        case setKochSnowflakeSettings.type:
            return {
                ...state,
                stepCount: action.payload.stepCount,
                startWord: action.payload.startWord,
                elementaryRule: action.payload.elementaryRule,
                anglePlus: action.payload.anglePlus,
                angleMinus: action.payload.angleMinus,
            };
        default:
            return state;
    }
};

export default settingsReducer;
