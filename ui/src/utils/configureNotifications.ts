import {notification} from 'antd'

export default function configureNotifications() {
    notification.config({
        getContainer: () => document.getElementById('root').firstChild as HTMLDivElement
    })
}
