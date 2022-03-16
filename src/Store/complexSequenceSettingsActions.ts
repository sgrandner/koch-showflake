import { createAction, defineProps } from './createAction';

export const setComplexSequenceSettings = createAction('Set Complex Sequence Settings', defineProps<{
    iterationMax: number,
}>());
