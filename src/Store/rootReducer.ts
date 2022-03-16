import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import complexSequenceSettingsReducer from './complexSequenceSettingsReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
    // NOTE you have to pass formReducer under 'form' key
    form: formReducer,
    settings: settingsReducer,
    complexSequenceSettings: complexSequenceSettingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
