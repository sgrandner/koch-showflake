import { AnyAction } from 'redux';

import {
    ADD_ONE,
    MINUS_ONE,
} from './actions';

export type SettingsState = {
    asdf: number;
};

const initialState: SettingsState = {
    asdf: 0,
};

const settingsReducer = (state = initialState, action: AnyAction): SettingsState => {

    switch (action.type) {
        case ADD_ONE:
            return {
                asdf: state.asdf + 1
            };
        case MINUS_ONE:
            return {
                asdf: state.asdf - 1
            };
        case "SET_SETTINGS":
            return action.payload;
        default:
            return state;
    }
};

export default settingsReducer;
