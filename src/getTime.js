/** @param {number} x */
const format = x => x.toString().padStart(2, '0');

let deltaTime = 0;

fetch('https://andthetimeis.com/utc/now')
    .then(res => res.text())
    .then(serverTime => {
        deltaTime = (new Date(serverTime)).getTime() - Date.now();
    })
    .catch(err => {
        alert('Failed to fetch current time online! Local time is used instead.');
        console.error(err);
    });

export const getTime = () => {
    const time = new Date(Date.now() + deltaTime);
    return [time.getHours(), time.getMinutes(), time.getSeconds()]
        .map(format)
        .join(':');
};
