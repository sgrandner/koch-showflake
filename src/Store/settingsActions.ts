export const ADD_ONE = 'ADD_ONE';
export const MINUS_ONE = 'MINUS_ONE';

const createAction = <T>(type: string) => {
    return {
        type,
        create: (payload: T) => {
            return {
                type,
                payload,
            };
        },
    };
};

export const setFirstnameAction = createAction<{ firstname: string }>('Set Firstname Action');

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

// class SetFirstnameAction {
//     type: string;
//     payload: any;

//     constructor(type: string, payload: any) {
//         this.type = type;
//         this.payload = payload;
//     }

//     getTypeAndPayload() {
//         return {
//             type: this.type,
//             payload: this.payload,
//         };
//     }
// }
