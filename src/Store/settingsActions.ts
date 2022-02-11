export const ADD_ONE = 'ADD_ONE';
export const MINUS_ONE = 'MINUS_ONE';

// const createAction = <T>(type: string) => {
//     return {
//         type,
//         create: (payload: T) => {
//             return {
//                 type,
//                 payload,
//             };
//         },
//     };
// };

// export const setFirstnameAction = createAction<{ firstname: string }>('Set Firstname Action');

// TODO several tests, delete when finished
// export const SET_FIRSTNAME_ACTION = 'Set Firstname Action';
// export const setFirstnameAction = (firstname: string) => {
//     return {
//         type: 'Set Firstname Action',
//         payload: {
//             firstname,
//         },
//     };
// };

type Creator<P extends any[] = any[], R extends object = object> = (...args: P) => R;

interface TypedAction<T extends string> {
    readonly type: T
}

type ActionCreator<T extends string = string, C extends Creator = Creator> = C & TypedAction<T>;


const createAction = <T extends string, C extends Creator>(
    type: T,
    config?: C,
): ActionCreator<T> => {

    let creator;
    if (!!config) {

        creator = (...props: any[]) => (
            {
                ...props,
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

const setFirstnameAction = createAction('Set Firstname Action', { firstname: string });

const qwer = setFirstnameAction.type;
const asdf = setFirstnameAction({ firstname: 'asdf' });



// class ActionCreator<T extends string, C extends Creator = Creator> {

//     public type: T;
//     private payload: P;

//     constructor(type: T, payload: P) {
//         this.type = type;
//         this.payload = payload;
//     }

//     // static generate(type: T, payload: P) {
//     //     return new ActionCreator(type, payload);
//     // }

//     getTypeAndPayload() {
//         return {
//             type: this.type,
//             payload: this.payload,
//         };
//     }
// }

// export const setFirstnameAction = (payload: any) => new ActionCreator<{ firstname: string }>('Set Firstname Action', payload);
// export const setFirstnameAction = (payload: any) => ActionCreator.generate('Set Firstname Action', payload);
