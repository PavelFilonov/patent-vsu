import {LOCAL_DEVELOPMENT} from './constants'

const opt = JSON.parse(document.getElementById('options').innerText)

export function getOptions() {
    if (!opt) {
        console.warn('opt is unavailable')
    }
    return {
        raHost: opt.raHost,
        branchName: typeof opt.branchName === 'string' && opt.branchName.length ? opt.branchName : LOCAL_DEVELOPMENT,
        noSSO: opt.noSSO && opt.noSSO === 'true'
    }
}
