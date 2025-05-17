import React from 'react'
import customIcon from '../../../assets/icons/customOperationIcon'

type IconType = keyof typeof customIcon

interface CustomIconProps {
    type: IconType | string
    className?: string
}
const CustomIcon: React.FunctionComponent<CustomIconProps> = props => {
    const {type, className} = props
    return <img alt={type} className={className} src={customIcon[type as IconType]} />
}

export default React.memo(CustomIcon)
