import {
    createAction,
    defineProps,
} from './createAction';

export const setKochSnowflakeSettings = createAction('Set Koch Snowflake Settings', defineProps<{
    stepCount: number,
    startWord: string,
    ruleA: string,
    ruleB: string,
    anglePlus: number,
    angleMinus: number,
    offsetX: number,
    offsetY: number,
}>());
