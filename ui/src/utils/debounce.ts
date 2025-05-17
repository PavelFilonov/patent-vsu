export const debounce = <T extends (...rest: unknown[]) => void>(f: T, ms: number) => {
    let isDowntime = false

    return (...rest: unknown[]) => {
        if (isDowntime) return

        f(...rest)

        isDowntime = true

        setTimeout(() => {
            isDowntime = false
        }, ms)
    }
}
