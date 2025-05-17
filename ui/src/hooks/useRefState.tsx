import React, {useCallback} from 'react'

type CallbackValue<S> = (prevState: S) => S
type SetRefState<S> = S | CallbackValue<S>

export function useRefState<T>(initialValue?: T) {
    const value = React.useRef<T>(initialValue)
    const setValue = useCallback((newValue: SetRefState<T>) => {
        if (typeof newValue === 'function') {
            const callback = newValue as CallbackValue<T>
            value.current = callback(value.current)
        } else {
            value.current = newValue
        }
    }, [])

    return [value, setValue] as [typeof value, typeof setValue]
}
