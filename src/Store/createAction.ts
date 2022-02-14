// NOTE typed action creators as implemented in ngrx but not that advanced
// https://github.com/ngrx/platform

type ActionCreator<T extends string = string, C extends Creator = Creator> = ActionType<T> & C;

type Creator<P extends any = any, A extends object = object> = (props: P) => A;

export interface ActionType<T extends string> {
    readonly type: T
}

interface PropsType<P> {
    propsType: P,
}

/**
 * Defines type P of action payload by calling this generic method
 * @returns PropsType<P>
 */
export function defineProps<P extends object>(): PropsType<P> {
    return { propsType: undefined! };
};

/**
 * method to create typed action without payload
 * @param type action type
 */
export function createAction<T extends string>(
    type: T,
): ActionCreator<T, () => ActionType<T>>;

/**
 * method to create typed action with payload
 * @param type action type
 * @param propsType PropsType of payload defined by defineProps()
 */
export function createAction<T extends string, P extends object>(
    type: T,
    propsType: PropsType<P>,
): ActionCreator<T, (props: P) => P & ActionType<T>>;

export function createAction<T extends string>(
    type: T,
    propsType?: PropsType<unknown>,
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

    return Object.defineProperty(
        creator,
        'type',
        {
            value: type,
            writable: false,
        },
    ) as ActionCreator<T>;
};
