import { useState, useEffect, useContext } from 'react'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import { Draggable } from 'react-beautiful-dnd'

const QueueTrack = ({ type, track, index, trackSelected, setTrackSelected }) => {

    const [ selected, setSelected ] = useState( false )
    const { playNextQueue } = useContext( PlayerHookContext )
    const { queue, qIndex, setQIndex } = useContext( DbHookContext )

    const handleTrackSelect = () => {
        const thisTrack = trackSelected.find(( x ) => x.id === track.id)
        if(thisTrack){
            setTrackSelected( trackSelected => trackSelected = trackSelected.filter(( x ) => {
                return x.id !== track.id 
            }))
        } else {
            setTrackSelected( trackSelected => trackSelected = [ track, ...trackSelected ] )
        }
    }

    useEffect(() => {
        const thisTrack = trackSelected.find(( x ) => x.id === track.id)
        if (thisTrack) {
            setSelected( true )
        } else {
            setSelected( false )
        }
    },[ trackSelected, qIndex ])

    const playTrack = (e) => {
        e.stopPropagation()
        const index = queue.findIndex( x => x.id === track.id )
        setQIndex( index )
    }

    return(
        <Draggable
        key={`${ track.id }--${index}--${type}`}
        index={ index } 
        draggableId={`${ track.id }--${index}--${type}`}>
            { provided => (
                <div 
                key={`${ track.id }--${index}--${type}`}
                ref={provided.innerRef} 
                style={ provided.draggableStyle }
                {...provided.draggableProps} 
                {...provided.dragHandleProps}className={ `queueTrack`}>
                    <span onClick={ handleTrackSelect } className='queueTrack__radio'>
                        <input type='radio' />
                        <span className={` queueTrack__radio__control ${ selected && 'queueTrack__radio__control--selected'}`}></span>
                    </span>
                    
                    <p className='queueTrack__title' onClick={ playTrack }> { track.name }</p>
                    <p className='queueTrack__info' onClick={ playTrack }> { track.artists[0].name} </p>

                    <i className="fas fa-bars"></i>
                </div>              
            )}

        </Draggable>
    )
}

export default QueueTrack