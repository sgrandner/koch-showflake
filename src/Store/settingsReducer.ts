import { AnyAction } from 'redux';

import { setKochSnowflakeSettings } from './settingsActions';

export type SettingsState = {
    stepCount: number;
    elementaryRuleString: string;
};

const initialState: SettingsState = {
    stepCount: 1,
    elementaryRuleString: 'LRL',
};

const settingsReducer = (state = initialState, action: AnyAction): SettingsState => {

    switch (action.type) {
        // TODO payload not typed
        case setKochSnowflakeSettings.type:
            return {
                ...state,
                stepCount: action.payload.stepCount,
                elementaryRuleString: action.payload.elementaryRuleString,
            };
        default:
            return state;
    }
};

export default settingsReducer;
