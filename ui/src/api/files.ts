import {axiosInstance} from './session'
const fileControllerMapping = 'file'

export function getDownloadFileEndpoint(screen: string, bcUrl: string) {
    return axiosInstance.defaults.baseURL.endsWith('/')
        ? `${axiosInstance.defaults.baseURL}${fileControllerMapping}/${screen}/${bcUrl}`
        : `${axiosInstance.defaults.baseURL}/${fileControllerMapping}/${screen}/${bcUrl}`
}
export function getSeFileEndpoint(screen: string, bcUrl: string, {controllerMapping} = {controllerMapping: fileControllerMapping}) {
    return `${controllerMapping}/${screen}/${bcUrl}`
}

export function getMessageDownloadFileEndpoint(link: string) {
    return axiosInstance.defaults.baseURL.endsWith('/')
        ? `${axiosInstance.defaults.baseURL}${fileControllerMapping}/${link}`
        : `${axiosInstance.defaults.baseURL}/${fileControllerMapping}/${link}`
}
