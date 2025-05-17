import {Session} from '@tesler-ui/core/interfaces/session'

export interface LanguagesResponse {
    data: Language[]
}

export interface Language {
    type: string
    key: string
    value: string
    description: string
    language: string
    displayOrder: number
    active: boolean
    // cacheLoaderName: ,
}

export interface LaLanguagesResponse {
    data: LaLanguage[]
}

export interface LaLanguage {
    displayname: string
    isocode: string
    name: string
}

export interface TeslerSessionState extends Session {
    languages: Language[]
    laLanguages: LaLanguage[]
    languageCd: string
    signOut: boolean
}
