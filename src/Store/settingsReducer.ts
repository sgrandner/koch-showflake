import { AnyAction } from 'redux';

import { setKochSnowflakeSettings } from './settingsActions';

export type SettingsState = {
    stepCount: number;
    startWordString: string;
    elementaryRuleString: string;
    anglePlus: number;
    angleMinus: number;
};

const initialState: SettingsState = {
    stepCount: 0,
    startWordString: '',
    elementaryRuleString: '',
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
                startWordString: action.payload.startWordString,
                elementaryRuleString: action.payload.elementaryRuleString,
                anglePlus: action.payload.anglePlus,
                angleMinus: action.payload.angleMinus,
            };
        default:
            return state;
    }
};

export default settingsReducer;
