import React, {ReactNode} from 'react'
import ReactDOM from 'react-dom'

interface PortalDrawerProps {
    children?: ReactNode
    getContainer: () => Element
}
const Portal: React.FunctionComponent<PortalDrawerProps> = props => {
    const {children, getContainer} = props
    const portalContainer = getContainer()
    return <>{portalContainer && ReactDOM.createPortal(children, portalContainer)}</>
}
export default React.memo(Portal)
