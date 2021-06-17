import { useContext } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import Controls from './Controls'
import Track from '../Track'
import QueueTrack from './QueueTrack'

const QueueView = ({ controls }) => {

    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat } = controls
    const { queue, queueIndex } = useContext( DbHookContext)
    const { currPlaying } = useContext( PlayerHookContext )
    return(
        <div className='PlQueueView'>
            <Track
            type='queueView'
            track={ currPlaying }/>
            <div className='queueContainer'>
                <h3> Next up: </h3>
            {
                queue.slice(1, 5).map( ( track, i )  => {
                    return(
                        <QueueTrack track={track} />
                    )
                })
            }
            </div>
            <Controls controls={ controls } />
        </div>
    )
}

export default QueueView