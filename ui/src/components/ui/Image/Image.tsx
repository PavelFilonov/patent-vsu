import React from 'react'
import RcImage, {ImageProps as AntdImageProps} from 'rc-image'
import cn from 'classnames'
import styles from './Image.less'

export interface ImageProps extends AntdImageProps {
    styleType?: 'remoteAudit'
    rootClassName?: AntdImageProps['wrapperClassName']
}

function Image({styleType, rootClassName, ...otherProps}: ImageProps) {
    return <RcImage wrapperClassName={cn(rootClassName, styleType && styles[styleType])} {...otherProps} />
}

export default React.memo(Image)
