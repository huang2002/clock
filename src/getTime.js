/** @param {number} x */
const format = x => x.toString().padStart(2, '0');

export const getTime = () => {
    const time = new Date();
    return [time.getHours(), time.getMinutes(), time.getSeconds()]
        .map(format)
        .join(':');
};
