import { useContext, useEffect, useState, useRef } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import Controls from './Controls'
import Track from '../Track'
import QueueTrack from './QueueTrack'
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd'

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



    const handleAddToPlayNext = () => {
        setPlayNextQueue( playNextQueue => playNextQueue = [ ...playNextQueue, ...queueViewSelected ])
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
    
    const dragStart = () =>{

    }

    const dragUpdate = (e) => {
        console.log(e)
    }

    const dragEnd = (e) => {
        if( e.destination && e.source ){
            if( e.destination.droppableId === e.source.droppableId ){
                if( e.destination.droppableId === 'queue' ){
                    const result = moveIndex( e.source.index + 1, e.destination.index + 1, queue )
                    setQueue( result )

                } else {
                    const result = moveIndex( e.source.index, e.destination.index, playNextQueue )
                    setPlayNextQueue( result )
                }
            } else {
                if(e.destination.droppableId === 'queue'){
                    const result = moveIndexBetween(e.source.index, playNextQueue, e.destination.index + 1 , queue )
                    setQueue( result[1] )
                    setPlayNextQueue( result[0] )
                } else {
                    const result = moveIndexBetween(e.source.index + 1 , queue, e.destination.index, playNextQueue,  )
                    setQueue( result[0] )
                    setPlayNextQueue( result[1] )
                }
            }
            
        }
    }

    const moveIndexBetween = ( from, arr1, to, arr2 ) => {
        const item = arr1.splice( from, 1 )[0]
        arr2.splice( to, 0, item )
        return [ arr1, arr2 ]
    }

    const moveIndex = ( from, to, arr ) => {
        const item = arr.splice( from, 1 )[0]
        arr.splice( to, 0, item)
        return arr
    }

    return(
        <div className='plQueueView'>
            <p ref={nowPlayingHeaderRef} className='plQueueView__nowPlaying'>Now playing: </p> 
            <Track
            type='queueView'
            track={ currPlaying }/>

            <DragDropContext
            onDragStart={ dragStart }
            onDragUpdate={ dragUpdate }
            onDragEnd={ dragEnd } >>
                <Droppable droppableId={'playNext'}>
                { provided => (
                    
                    <div className=' queueContainer' {...provided.droppableProps} ref={provided.innerRef}>
                        {
                            playNextQueue.length > 0 && 
                            <>
                            <div ref={ playNextHeaderRef } className='queueContainer__title'>
                                <p> Next In Queue </p>
                                <button onClick={ removePlayNext }> Clear queue </button> 
                            </div>
                            {
                                playNextQueue.map(( track, i ) => (
                                    
                                        <QueueTrack 
                                        type='playNext'
                                        track={track}
                                        index={ i }
                                        trackSelected={ playNextQueueSelected } 
                                        setTrackSelected={ setPlayNextQueueSelected }
                                        />
                                    
                                ))
                            }
                            {provided.placeholder}  
                            </>
                        }
                    </div>
                )}
                
                </Droppable>
                <Droppable droppableId={'queue'}>
                { provided => (
                    <div className='queueContainer' {...provided.droppableProps} ref={provided.innerRef}>
                        <div ref={ queueHeaderRef } className='queueContainer__title'>
                            <p> Up next: </p>
                        </div>
                    
                {
                    queue.slice( qIndex + 1  ).map( ( track, i )  => {
                        return(
                            <QueueTrack 
                            type='queue'
                            track={track} 
                            index={ i }
                            trackSelected={ queueViewSelected }
                            setTrackSelected={ setQueueViewSelected }/>
                        )
                    })
                }
                        {provided.placeholder}  
                    </div>   
                    
                )}
           
                </Droppable>
            </DragDropContext>
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