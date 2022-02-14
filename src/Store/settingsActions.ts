import {
    createAction,
    defineProps,
} from './createAction';

export const ADD_ONE = 'ADD_ONE';
export const MINUS_ONE = 'MINUS_ONE';

export const setFirstnameAction = createAction('Set Firstname Action', defineProps<{ firstname: string }>());
export const resetAction = createAction('Reset Action');
export const fancyAction = createAction('Fancy Action', defineProps<{ aaa: string, bbb: number }>());

const qwer = setFirstnameAction.name;
const asdf = setFirstnameAction({ firstname: 'asdf' });
const asdfa = setFirstnameAction({ firstnamee: 'asdf' });   // NOTE this should be wrong !
const asdff = setFirstnameAction();                         // NOTE this should be wrong !

const qwer2 = resetAction.name;
const asdf2 = resetAction();
const asdff2 = resetAction({ asdf: '423141' });             // NOTE this should be wrong !

const qwer3 = fancyAction.name;
const asdf3 = fancyAction({ aaa: 'asdf', bbb: 42 });
const asdfa3 = fancyAction({ aaa: 'asdf', bbb: '42' });     // NOTE this should be wrong !
const asdfb3 = fancyAction({ aaa: 'asdf' });                // NOTE this should be wrong !
const asdff3 = fancyAction();                               // NOTE this should be wrong !

console.log(qwer, asdf, qwer2, asdf2, qwer3, asdf3);
