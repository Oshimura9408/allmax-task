export default function throttle (callback, limit) {
    let wait = false;
    return function () {
        if (!wait && callback !== undefined) {
            callback.call();
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    }
}
