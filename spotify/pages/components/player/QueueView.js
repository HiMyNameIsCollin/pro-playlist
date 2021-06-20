import { useContext, useEffect, useState, useRef } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import Controls from './Controls'
import Track from '../Track'
import QueueTrack from './QueueTrack'

const QueueView = ({ handleTrackMenu, controls }) => {

    const [ queueViewSelected, setQueueViewSelected ] = useState([])
    const [ playNextQueueSelected, setPlayNextQueueSelected ] = useState([])
    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat } = controls
    const { queue, setQueue, qIndex, setQIndex, playNextQueue, setPlayNextQueue } = useContext( DbHookContext)
    const playNextSyncedRef = useRef( false)
    const { currPlaying } = useContext( PlayerHookContext )
    
    const handleAddToPlayNext = () => {
        setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue, ...queueViewSelected ])
        setQueue( queue => queue = [ ...queue.slice( 0, qIndex + 1 ), ...queueViewSelected, ...queue.slice(qIndex + 1) ]) 
        setQueueViewSelected( [] ) 
    }
    


    useEffect(() => {
        if( playNextQueue[0] && currPlaying.id === playNextQueue[0].id){
            setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue.slice(1) ] )
           
        }
    }, [ currPlaying, qIndex ])



    const handleRemove = () => {
        if( playNextQueueSelected.length > 0){
            let arr = [] 
            let arr2 = []
            playNextQueue.forEach(( t, i ) => {
                const thisTrack = playNextQueueSelected.find( x => x.id === t.id )
                if( !thisTrack ){
                    arr.push( t )
                } else {
                    arr2.push( t )
                }
            })
            setPlayNextQueue( arr )
            setPlayNextQueueSelected( [] )
            setQueue( queue => queue = [ queue[0], ...queue.slice( arr2.length ) ])
        }

        if( queueViewSelected.length > 0 ) {

        }
    }

    const removePlayNext = () => {
        setPlayNextQueue( [] )
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
                queue.slice( qIndex + 1 + playNextQueue.length  ).map( ( track, i )  => {
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