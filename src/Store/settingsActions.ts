export const ADD_ONE = 'ADD_ONE';
export const MINUS_ONE = 'MINUS_ONE';

// NOTE typed action creators as implemented in ngrx but not that advanced
// https://github.com/ngrx/platform

interface TypedAction<T extends string> {
    readonly type: T
}

type Creator<P extends any = any, R extends object = object> = (props: P) => R;

type ActionCreator<T extends string = string, C extends Creator = Creator> = C & TypedAction<T>;

interface PropsType<P> {
    propsType: P,
}

function props<P extends object>(): PropsType<P> {
    return { propsType: undefined! };
};

function createAction<T extends string>(
    type: T,
): ActionCreator<T, () => TypedAction<T>>;

function createAction<T extends string, P extends object>(
    type: T,
    config: PropsType<P>,
): ActionCreator<T, (props: P) => P & TypedAction<T>>;

function createAction<T extends string>(
    type: T,
    propsType?: any,
): ActionCreator<T> {

    let creator: Creator;

    if (!!propsType) {
        creator = (props) => (
            {
                payload: {
                    ...props,
                },
                type,
            }
        );
    } else {
        creator = () => (
            {
                type,
            }
        );
    }

    return Object.defineProperty(creator, 'type', {
        value: type,
        writable: false,
    }) as ActionCreator<T>;
};

export const setFirstnameAction = createAction('Set Firstname Action', props<{ firstname: string }>());
export const resetAction = createAction('Reset Action');
export const fancyAction = createAction('Fancy Action', props<{ aaa: string, bbb: number }>());

const qwer = setFirstnameAction.type;
const asdf = setFirstnameAction({ firstname: 'asdf' });
// const asdfa = setFirstnameAction({ firstnamee: 'asdf' });   // NOTE this should be wrong !
// const asdff = setFirstnameAction();                         // NOTE this should be wrong !

const qwer2 = resetAction.type;
const asdf2 = resetAction();
// const asdff2 = resetAction({ asdf: '423141' });             // NOTE this should be wrong !

const qwer3 = fancyAction.type;
const asdf3 = fancyAction({ aaa: 'asdf', bbb: 42 });
// const asdfa3 = fancyAction({ aaa: 'asdf', bbb: '42' });     // NOTE this should be wrong !
// const asdfb3 = fancyAction({ aaa: 'asdf' });                // NOTE this should be wrong !
// const asdff3 = fancyAction();                               // NOTE this should be wrong !

console.log(qwer, asdf, qwer2, asdf2, qwer3, asdf3);
