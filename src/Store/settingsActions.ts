import {
    createAction,
    defineProps,
} from './createAction';

export const ADD_ONE = 'ADD_ONE';
export const MINUS_ONE = 'MINUS_ONE';

export const setFirstnameAction = createAction('Set Firstname Action', defineProps<{ firstname: string }>());
