import { useContext, useState } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import Controls from './Controls'
import Track from '../Track'
import QueueTrack from './QueueTrack'

const QueueView = ({ controls }) => {

    const [ queueViewSelected, setQueueViewSelected ] = useState([])
    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat } = controls
    const { queue, queueIndex } = useContext( DbHookContext)
    const { currPlaying, playNextQueue, setPlayNextQueue } = useContext( PlayerHookContext )
    
    const handleRemove = () => {
        
    }

    const handlePlayNext = () => {
        setPlayNextQueue( playNextQueue => playNextQueue = [...playNextQueue, ...queueViewSelected ])
        setQueueViewSelected( [] )
    }

    const removePlayNext = () => {
        setPlayNextQueue([])
    }
    
    return(
        <div className='PlQueueView'>
            <Track
            type='queueView'
            track={ currPlaying }/>
            {
            playNextQueue.length > 0 &&
            <div className=' queueContainer'>
                <div className='queueContainer__title'>
                    <h3> Next In Queue </h3>
                    <span onClick={ removePlayNext }> Clear queue </span> 
                </div>
                {
                playNextQueue.map(( track, i ) => {
                    return(
                        <QueueTrack 
                        track={track} 
                        queueViewSelected={ queueViewSelected }
                        setQueueViewSelected={ setQueueViewSelected }/>
                    )
                })
                }
                
            </div>
            }

            <div className='queueContainer'>
                <div className='queueContainer__title'>
                    <h3> Up next: </h3>
                </div>
            {
                queue.slice(1, 5).map( ( track, i )  => {
                    return(
                        <QueueTrack 
                        track={track} 
                        queueViewSelected={ queueViewSelected }
                        setQueueViewSelected={ setQueueViewSelected }/>
                    )
                })
            }
            </div>
            {
                queueViewSelected.length > 0 ?
                <div className='queueControls'>
                    <span onClick={ handleRemove }> Remove </span>
                    
                    <span onClick={ handlePlayNext } > Add to Queue </span>
                </div> : 
                <Controls controls={ controls } />
            }
            
        </div>
    )
}

export default QueueView