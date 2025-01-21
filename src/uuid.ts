export function createInstance(key: string = 'uuid') {
    let idx = 0;

    return function () {
        return `${key}-${idx}|`
    }
}


export default createInstance();


