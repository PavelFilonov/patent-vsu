import React, {FC, useEffect, useRef, useState} from 'react'
import {Icon, Button} from 'antd'
import {ApplicationError} from '@tesler-ui/core/interfaces/view'

interface ErrorMessageProps {
    title: string
    id: string
    error: ApplicationError
    onClose: () => void
}

const Popup: FC<ErrorMessageProps> = ({title, id, onClose}) => {
    const popupRef = useRef(null)
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(id)
        setIsCopied(true)

        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    return (
        <>
            <div className="error-popup" ref={popupRef}>
                <Button type="default" className="close-button" onClick={onClose}>
                    X
                </Button>
                <div style={{display: 'flex'}}>
                    <Icon type="exclamation-circle" style={{color: '#ff5a5a', paddingTop: '5px', fontSize: '24px'}} />
                    <div className="error-popup-title">{title}</div>
                </div>
                <div className="error-popup-message">System error has occurred!</div>
                <div className="error-popup-id">
                    Error ID: {id}
                    <Button
                        type="link"
                        icon="copy"
                        onClick={copyToClipboard}
                        style={{marginLeft: '8px', color: isCopied ? 'green' : undefined}}
                    >
                        {isCopied ? 'Copied' : 'Copy'}
                    </Button>
                </div>
                <p className="error-popup-message">Please use this error ID when you create a Service Desk ticket.</p>
            </div>
        </>
    )
}

export default Popup
