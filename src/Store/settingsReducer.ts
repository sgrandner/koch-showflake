import { AnyAction } from 'redux';

import {
    ADD_ONE,
    MINUS_ONE,
    setFirstnameAction,
} from './settingsActions';

export type SettingsState = {
    asdf: number;
    firstname: string | undefined;
};

const initialState: SettingsState = {
    asdf: 0,
    firstname: undefined,
};

const settingsReducer = (state = initialState, action: AnyAction): SettingsState => {

    switch (action.type) {
        case ADD_ONE:
            return {
                ...state,
                asdf: state.asdf + 1
            };
        case MINUS_ONE:
            return {
                ...state,
                asdf: state.asdf - 1
            };
        // TODO payload not typed
        case setFirstnameAction.type:
            return {
                ...state,
                firstname: action.payload.firstname,
            };
        default:
            return state;
    }
};

export default settingsReducer;
