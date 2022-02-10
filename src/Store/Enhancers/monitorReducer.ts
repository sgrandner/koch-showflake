import {
    Action,
    PreloadedState,
    Reducer,
    Store,
    StoreCreator,
    StoreEnhancer,
} from 'redux';

const round = (number: number) => Math.round(number * 100) / 100

const monitorReducerEnhancer =
    (createStore: StoreCreator) =>
        <S, A extends Action, Ext, StateExt>(reducer: Reducer<S & StateExt, A>, initialState: PreloadedState<S & StateExt>, enhancer: StoreEnhancer<Ext>): Store<S & StateExt, A> & Ext => {

            const monitoredReducer = (state: S & StateExt | undefined, action: A) => {
                const start = performance.now();
                const newState = reducer(state, action);
                const end = performance.now();
                const diff = round(end - start);

                console.log('reducer process time:', diff);

                return newState;
            };

            return createStore(monitoredReducer, initialState, enhancer);
        };

export default monitorReducerEnhancer;
