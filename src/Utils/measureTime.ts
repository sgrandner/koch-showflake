
const measureTime = (fn: Function) => {

    const before = new Date();

    fn();

    const after = new Date();

    return after.getTime() - before.getTime();
};

export default measureTime;
