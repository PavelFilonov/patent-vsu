import React from 'react'
import styles from './Logo.less'
import icons from '../../../assets/icons'

const Logo = () => {
    return <img className={styles.bigLogo} alt="vsu_logo" src={icons.VsuLogo} />
}

export default React.memo(Logo)
