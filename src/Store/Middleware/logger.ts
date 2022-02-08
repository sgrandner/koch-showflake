import { Middleware } from 'redux';

// typed middleware see https://stackoverflow.com/questions/45339448/how-do-you-create-strongly-typed-redux-middleware-in-typescript-from-reduxs-typ

const logger: Middleware = (store) => (next) => (action) => {

    console.group(action.type);
    console.info('dispatching', action);

    let result = next(action);

    console.log('next state', store.getState());
    console.groupEnd();

    return result;
};

export default logger;
