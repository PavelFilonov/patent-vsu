import React from 'react'
import filterIcon from '../img/filter.svg'

function FilterIcon() {
    return <img src={filterIcon} alt="filterIcon" />
}

export default React.memo(FilterIcon)
