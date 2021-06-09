import Track from './Track'
import { useState, useEffect, useContext } from 'react'
import { DbHookContext } from './Dashboard'
const PlayerCollapsed = () => {

    const { queue } = useContext( DbHookContext)

    return (
        <div className='player player--collapsed'>
            {
                queue[0] && queue[0].album &&
                <Track type='player--collapsed' track={ queue[0] } />
            }
            <i className="fas fa-play player--collapsed--playBtn"></i>
        </div>
    )
}

export default PlayerCollapsed