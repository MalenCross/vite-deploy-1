export function generateGrossIncomes(min: number, max: number): number[] {
    if (min > max) {
        return []
    }
    let arr = []
    for (let i = min; i < max; i += 5000) {
        arr.push(i)
    }

    return arr;
}
