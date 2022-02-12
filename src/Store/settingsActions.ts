import { AnyAction } from 'redux';

export const ADD_ONE = 'ADD_ONE';
export const MINUS_ONE = 'MINUS_ONE';

// NOTE action creators inspired by ngrx but not that complicated

type Creator<P extends object, R extends AnyAction = AnyAction> = (props: P) => R;

interface TypedAction<T extends string> {
    readonly type: T
}

type ActionCreator<T extends string, P extends object, C extends Creator<P> = Creator<P>> = C & TypedAction<T>;

interface PropsType<P> {
    propsType: P,
}

const props = <P extends object>(): PropsType<P> => {
    return { propsType: undefined! };
};

const createAction = <T extends string, P extends object>(
    type: T,
    config?: PropsType<P>,
): ActionCreator<T, P> => {

    let creator: Creator<P>;

    if (!!config) {
        creator = (props: P): AnyAction => (
            {
                payload: {
                    ...props,
                },
                type,
            }
        );
    } else {
        creator = (): AnyAction => (
            {
                type,
            }
        );
    }

    return Object.defineProperty(creator, 'type', {
        value: type,
        writable: false,
    }) as ActionCreator<T, P>;
};



export const setFirstnameAction = createAction('Set Firstname Action', props<{ firstname: string }>());
export const resetAction = createAction('Reset Action');

const qwer = setFirstnameAction.type;
const asdf = setFirstnameAction({ firstname: 'asdf' });
const asdff = setFirstnameAction();                  // NOTE this should be wrong !

const qwer2 = resetAction.type;
const asdf2 = resetAction();
const asdff2 = resetAction({ asdf: '423141' });      // FIXME this should be wrong !


const yxcv = null;

console.log(qwer, asdf, yxcv);
