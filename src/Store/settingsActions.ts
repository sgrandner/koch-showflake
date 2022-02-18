import {
    createAction,
    defineProps,
} from './createAction';

export const setKochSnowflakeSettings = createAction('Set Koch Snowflake Settings', defineProps<{
    stepCount: number,
    startWord: string,
    elementaryRule: string,
    anglePlus: number,
    angleMinus: number,
}>());
