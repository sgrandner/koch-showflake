import {
    createAction,
    defineProps,
} from './createAction';

export const setStepCount = createAction('Set Step Count', defineProps<{ steps: number }>());
