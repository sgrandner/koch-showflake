import {
    applyMiddleware,
    compose,
    createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import monitorReducerEnhancer from './Enhancers/monitorReducer';
import loggerMiddleware from './Middleware/logger';
import rootReducer from './reducer';

// TODO types !!!

const configureStore = (preloadedState?: any) => {

    // TODO see https://redux.js.org/usage/configuring-your-store/

    const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware);
    const composedEnhancers = compose(middlewareEnhancer, monitorReducerEnhancer);

    const store = createStore(rootReducer, preloadedState, composedEnhancers as any);

    return store;
};

export default configureStore;
