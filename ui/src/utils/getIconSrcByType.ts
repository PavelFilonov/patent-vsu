import parent from '../assets/icons/parent'
import {SmIconType} from '../interfaces/widget'

export function getIconSrcByType(value: string, iconType: SmIconType) {
    const lowerCaseValue = value?.toLowerCase()
    try {
        switch (iconType) {
            case 'parent':
                return parent[lowerCaseValue as keyof typeof parent]
            default:
                return value
        }
    } catch (e) {
        return value
    }
}
