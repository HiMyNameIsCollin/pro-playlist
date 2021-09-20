import { useContext } from 'react'

import { DbHookContext } from './Dashboard'

const LoadingBubbles = () => {

    const { dashboardRef } = useContext( DbHookContext )
    
    return(
        <div style={{ top: dashboardRef.current.scrollTop }} className='loadingBubbles'>
            <span> </span>
            <span> </span>
            <span> </span>
        </div>
    )
}

export default LoadingBubbles