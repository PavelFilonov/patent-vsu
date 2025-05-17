import {SmField, SmFieldTypes} from '../interfaces/widget'

export default function getFields(listFields: SmField[]) {
    let result: SmField[] = []
    listFields?.forEach(field => {
        if (field.type !== SmFieldTypes.Composite) {
            result.push(field)
        } else {
            result = result.concat(getFields(field.fields))
        }
    })
    return result
}
