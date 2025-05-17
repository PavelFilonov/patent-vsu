import React from 'react'
import {Operation, OperationGroup, OperationInclusionDescriptor} from '@tesler-ui/core/interfaces/operation'

type OperationInclusionDescriptorObject = Exclude<OperationInclusionDescriptor, string>

export function useOrderOfOperations(operations: Array<Operation | OperationGroup>, order: OperationInclusionDescriptor[]) {
    return React.useMemo(() => {
        let orderedOperations: Array<Operation | OperationGroup> = []
        if (!order || order.length === 0 || operations.length === 0) {
            return operations
        }
        const copy = [...operations]
        let i = 0
        for (i; i < order.length; i++) {
            if (copy.length === 0) {
                break
            }
            const type = typeof order[i] === 'string' ? order[i] : (order[i] as OperationInclusionDescriptorObject).type
            const index = copy.findIndex(item => item.type === type)
            const element = copy[index]
            if (element) {
                copy.splice(index, 1)
                orderedOperations.push(element)
            }
        }
        if (copy.length > 0) {
            orderedOperations = orderedOperations.concat([...copy])
        }

        return orderedOperations
    }, [operations, order])
}
