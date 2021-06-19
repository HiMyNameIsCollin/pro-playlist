import { useContext, useState } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import Controls from './Controls'
import Track from '../Track'
import QueueTrack from './QueueTrack'

const QueueView = ({ handleTrackMenu, controls }) => {

    const [ queueViewSelected, setQueueViewSelected ] = useState([])
    const [ playNextQueueSelected, setPlayNextQueueSelected ] = useState([])
    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat } = controls
    const { queue, setQueue, queueIndex } = useContext( DbHookContext)
    const { currPlaying, playNextQueue, setPlayNextQueue } = useContext( PlayerHookContext )
    
    const handleRemove = () => {
        if(playNextQueueSelected.length > 0){
            let arr = []
            playNextQueue.forEach(( t, i ) => {
                const thisTrack = playNextQueueSelected.find( x => x.id === t.id)
                if( !thisTrack ){
                    arr.push( t )
                }
            })
            setPlayNextQueue( arr )
            setPlayNextQueueSelected( [] )
        }
        if( queueViewSelected.length > 0 ){
            let arr = []
            queue.slice(1).forEach(( t, i ) => {
                const thisTrack = queueViewSelected.find( x => x.id === t.id )
                if( !thisTrack ){
                    arr.push( t )
                }
            })
            setQueue( queue => queue = [ queue[0], ...arr ] )
            setQueueViewSelected( [] )
        }
    }

    const handleAddToPlayNext = () => {
        setPlayNextQueue( playNextQueue => playNextQueue = [...playNextQueue, ...queueViewSelected ])
        setQueueViewSelected( [] )
    }

    const removePlayNext = () => {
        setPlayNextQueue([])
    }
    
    return(
        <div className='PlQueueView'>
            <h3 className='PlQueueView__nowPlaying'>Now playing: </h3> 
            <Track
            type='queueView'
            handleTrackMenu={ handleTrackMenu }
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
                        type='playNext'
                        track={track}
                        trackSelected={ playNextQueueSelected } 
                        setTrackSelected={ setPlayNextQueueSelected }
                        />
                    )
                })
                }
                
            </div>
            }
            {
                queue.length > 1 &&
                <div className='queueContainer'>
                    <div className='queueContainer__title'>
                        <h3> Up next: </h3>
                    </div>
            {
                queue.slice(1).map( ( track, i )  => {
                    return(
                        <QueueTrack 
                        type='queue'
                        track={track} 
                        trackSelected={ queueViewSelected }
                        setTrackSelected={ setQueueViewSelected }/>
                    )
                })
            }
                </div>                
            }

            {
                queueViewSelected.length > 0 || playNextQueueSelected.length > 0?
                <div className='queueControls'>
                    <span onClick={ handleRemove }> Remove </span>
                    
                    {
                        playNextQueueSelected.length === 0 &&
                        <span onClick={ handleAddToPlayNext } > Add to Queue </span>

                    }
                </div> : 
                <Controls controls={ controls } />
            }
            
        </div>
    )
}

export default QueueView