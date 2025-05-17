function checkIfCustomIcon(type: string) {
    switch (type) {
        case 'checkbox-on':
        case 'checkbox-off':
        case 'stack':
        case 'translation':
            return true
        default:
            return false
    }
}

export default checkIfCustomIcon
