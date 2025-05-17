import {DataItem} from '@tesler-ui/core/interfaces/data'

function removeDataItemDuplicates(input: DataItem[]) {
    const result: DataItem[] = []
    input.forEach((i: DataItem) => {
        if (!result.some(j => i.id === j.id)) {
            result.push(i)
        }
    })
    return result
}

export default removeDataItemDuplicates
