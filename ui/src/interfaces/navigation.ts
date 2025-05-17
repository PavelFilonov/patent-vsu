import {ScreenMetaResponse} from '@tesler-ui/core/interfaces/screen'

export interface TeslerScreenResponse extends ScreenMetaResponse {
    navigation: {
        menu: ViewNavigationGroup[]
    }
}

export interface ViewNavigationGroup {
    id: number
    title: string
    child: ViewNavigationItem[]
}

export interface ViewNavigationItem {
    viewName: string
}
