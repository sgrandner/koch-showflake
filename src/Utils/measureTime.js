
const measureTime = (fn) => {

    const before = new Date();

    fn();

    const after = new Date();

    return after.getTime() - before.getTime();
};

export default measureTime;
