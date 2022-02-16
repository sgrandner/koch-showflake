import {
    createAction,
    defineProps,
} from './createAction';

export const setKochSnowflakeSettings = createAction('Set Koch Snowflake Settings', defineProps<{
    stepCount: number,
    startWordString: string,
    elementaryRuleString: string,
    anglePlus: number,
    angleMinus: number,
}>());
