import {
    applyMiddleware,
    compose,
    createStore,
    Store,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import monitorReducerEnhancer from './Enhancers/monitorReducer';
import loggerMiddleware from './Middleware/logger';
import rootReducer, { RootState } from './rootReducer';

const configureStore = (preloadedState?: RootState): Store<RootState> => {

    const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware);
    const composedEnhancers = compose(middlewareEnhancer, monitorReducerEnhancer);

    // FIXME type of composedEnhancers !
    // see also https://stackoverflow.com/questions/50451854/trouble-with-typescript-typing-for-store-enhancers-in-redux-4-0
    return createStore(rootReducer, preloadedState, composedEnhancers as any);
};

export default configureStore;
