import React from 'react'
import {Button, Tooltip} from 'antd'
import {buildBcUrl, buildUrl, getFilters} from '@tesler-ui/core'
import qs from 'query-string'
import {BcFilter} from '@tesler-ui/core/interfaces/filters'
import {useSelector} from 'react-redux'
import {axiosInstance} from '../../../../api/session'
import {AppState} from '../../../../interfaces/reducers'

interface SubmitButtonWrapperProps {
    bcName: string
    onSubmit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const SubmitButtonWrapper: React.FunctionComponent<SubmitButtonWrapperProps> = props => {
    const {bcName, onSubmit} = props
    const initCount = useSelector((store: AppState) => store.view.smBcRecordsCount[bcName])
    const [resultCount, setResultCount] = React.useState(`Найдено ${initCount?.count ?? 0}`)
    const filters = useSelector((store: AppState) => store.screen.filters[bcName])
    const params = getFilters(filters as BcFilter[])
    const [url, setUrl] = React.useState(`${buildUrl`count/dashboard/`}${buildBcUrl(bcName)}?${qs.stringify(params, {encode: true})}`)

    React.useEffect(() => {
        setUrl(`${buildUrl`count/dashboard/`}${buildBcUrl(bcName)}?${qs.stringify(params, {encode: true})}`)
    }, [setUrl, bcName, params])

    React.useEffect(() => {
        let isMounted = true
        setResultCount('Подсчёт...')
        const fetchCount = async () => {
            const result = await axiosInstance.get(url)
            if (isMounted) {
                setResultCount(`Найдено ${result.data.data}`)
            }
        }
        fetchCount()
        return () => {
            isMounted = false
        }
    }, [setResultCount, url])

    return (
        <Tooltip title={resultCount}>
            <Button onClick={onSubmit}>Применить</Button>
        </Tooltip>
    )
}

export default React.memo(SubmitButtonWrapper)
