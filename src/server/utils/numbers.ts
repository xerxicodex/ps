export function PadWithZero(num: number, zeros: string = "000") {
    return (`${zeros}${num}`).slice(-1 * zeros.length);
}
