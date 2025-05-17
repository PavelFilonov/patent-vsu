import React from 'react'
import {Button, Icon} from 'antd'
import {Popup} from '@tesler-ui/core'
import Portal from '../Portal/Portal'
import styles from './CheckboxPopup.less'

interface CheckboxPopupProps {
    showed: boolean
    title: string
    bcName: string
    onCancel: () => void
    onSubmit: () => void
    searchComponent?: React.ReactNode
    paginationComponent?: React.ReactNode
    children?: React.ReactNode
}

const CheckboxPopup: React.FunctionComponent<CheckboxPopupProps> = props => {
    const {showed, title, bcName, onCancel, onSubmit, children, paginationComponent, searchComponent} = props
    const containerRef = React.useRef(null)
    const handleSubmit = React.useCallback(() => {
        onSubmit()
    }, [onSubmit])
    const customFooter = (
        <div className={styles.footerContainer}>
            {paginationComponent}
            <div className={styles.actions}>
                <Button onClick={handleSubmit} className={styles.buttonSave}>
                    Сохранить и продолжить
                </Button>
                <Button onClick={onCancel} className={styles.buttonCancel}>
                    Отменить
                </Button>
            </div>
        </div>
    )
    const defaultTitle = <h1 className={styles.title}>{title}</h1>
    // a search of DOM node for insertion of close icon
    const findModalDiv = () => containerRef?.current?.querySelector('.ant-modal')
    return (
        <div ref={containerRef}>
            <Portal getContainer={findModalDiv}>
                <Icon type="close" />
            </Portal>
            <Popup
                closable={false}
                showed={showed}
                bcName={bcName}
                width={paginationComponent && 653}
                title={
                    searchComponent ? (
                        <div>
                            {defaultTitle}
                            {searchComponent}
                        </div>
                    ) : (
                        defaultTitle
                    )
                }
                onCancelHandler={onCancel}
                footer={customFooter}
            >
                {children}
            </Popup>
        </div>
    )
}

export default React.memo(CheckboxPopup)
