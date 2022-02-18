import { AnyAction } from 'redux';

import { setKochSnowflakeSettings } from './settingsActions';

export type SettingsState = {
    stepCount: number;
    startWord: string;
    ruleA: string;
    ruleB: string;
    anglePlus: number;
    angleMinus: number;
};

const initialState: SettingsState = {
    stepCount: 0,
    startWord: '',
    ruleA: '',
    ruleB: '',
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
                ruleA: action.payload.ruleA,
                ruleB: action.payload.ruleB,
                anglePlus: action.payload.anglePlus,
                angleMinus: action.payload.angleMinus,
            };
        default:
            return state;
    }
};

export default settingsReducer;
