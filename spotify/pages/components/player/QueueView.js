import { useContext, useEffect, useState, useRef } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import Controls from './Controls'
import Track from '../Track'
import QueueTrack from './QueueTrack'

const QueueView = ({ handleTrackMenu, controls }) => {

    const [ queueViewSelected, setQueueViewSelected ] = useState([])
    const [ playNextQueueSelected, setPlayNextQueueSelected ] = useState([])
    
    const { currPlaying } = useContext( PlayerHookContext )
    const { queue, setQueue, qIndex, setQIndex, playNextQueue, setPlayNextQueue } = useContext( DbHookContext)
    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat } = controls

    const playNextHeaderRef= useRef()
    const queueHeaderRef = useRef()
    const nowPlayingHeaderRef = useRef()

    useEffect(() => {
        const playerHeaderHeight = document.querySelector('.playerLargeContainer__header').getBoundingClientRect().height
        document.querySelector('.plQueueView').style.paddingTop = playerHeaderHeight + 'px'
        nowPlayingHeaderRef.current.style.top = playerHeaderHeight + 'px'
        queueHeaderRef.current.style.top = playerHeaderHeight + 'px'
        if( playNextHeaderRef.current) playNextHeaderRef.current.style.top = playerHeaderHeight + 'px'
        
    }, [ playNextQueue ])

    useEffect(() => {
        if(playNextQueue[0]){
            if( queue[ qIndex + 1] && queue[ qIndex + 1 ].id !== playNextQueue[0].id){
                setQueue( queue => queue = [ ...queue.slice( 0, qIndex + 1 ), ...playNextQueue, ...queue.slice(qIndex + 1) ]) 
            } else if ( !queue[ qIndex + 1 ] ){
                setQueue( queue => queue = [ ...queue, ...playNextQueue ]) 

            }

        }
    },[ queue ])
    
    useEffect(() => {
        if( playNextQueue[0] && queue[ qIndex ].id === playNextQueue[0].id){
            setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue.slice(1) ] )
            setQueue( queue => queue = [ ...queue.slice( 0, qIndex + 1 ), ...queue.slice( qIndex + 1 ) ])
        }
    }, [ qIndex ])

    const handleAddToPlayNext = () => {
        setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue, ...queueViewSelected ])
        setQueue( queue => queue = [ ...queue.slice( 0, qIndex + 1 ), ...queueViewSelected, ...queue.slice(qIndex + 1) ]) 
        setQueueViewSelected( [] ) 
    }

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
            setQueue( queue => queue = [ queue[0], ...queue.slice( arr2.length + 1 ) ])
        }

        if( queueViewSelected.length > 0 ) {
            let arr = []
            queue.slice( qIndex + 1).forEach(( t, i ) => {
                const thisTrack = queueViewSelected.find( x => x.id === t.id )
                if( !thisTrack ) arr.push(t)
            })
            setQueue( queue => queue = [ ...queue.slice(0, qIndex + 1), ...arr ])
            setQueueViewSelected( [] )
        }
    }

    const removePlayNext = () => {
        setPlayNextQueue( [] )
    }


    return(
        <div className='plQueueView'>
            <p ref={nowPlayingHeaderRef} className='plQueueView__nowPlaying'>Now playing: </p> 
            <Track
            type='queueView'
            track={ currPlaying }/>
            {
            playNextQueue.length > 0 &&
            <div className=' queueContainer'>
                <div ref={ playNextHeaderRef } className='queueContainer__title'>
                    <p> Next In Queue </p>
                    <button onClick={ removePlayNext }> Clear queue </button> 
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
           
                <div className='queueContainer'>
                    <div ref={ queueHeaderRef } className='queueContainer__title'>
                        <p> Up next: </p>
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
             

            {
                queueViewSelected.length > 0 || playNextQueueSelected.length > 0?
                <div className='queueControls'>
                    <button onClick={ handleRemove }> Remove </button>
                    
                    {
                        playNextQueueSelected.length === 0 &&
                        <button onClick={ handleAddToPlayNext } > Add to Queue </button>

                    }
                </div> : 
                <Controls controls={ controls } />
            }
            
        </div>
    )
}

export default QueueView