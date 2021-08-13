import { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { createPortal } from 'react-dom'

const ActiveItemTrack = ({ track, orientation, index, selectedItems, setSelectedItems }) => {

    const [ selected, setSelected ] = useState(false)

    const thisTrack = track.id ? track : track.track

    useEffect(() => {
        if( selectedItems.includes( thisTrack.id )){
            setSelected( true )
        } else {
            setSelected( false )
        }
    }, [ selectedItems ])

    const handleSelection = () => {
        const trackId = thisTrack.id
        if( selected ){
            setSelectedItems( items => items = items.filter( x=> x !== trackId ))
        } else {
            setSelectedItems( items => items = [ ...items, trackId ])
        }
    }

    const optionalPortal = (styles, element) => {
        const _dragEl = document.getElementById('draggable')
        if(styles.position === 'fixed') {
          return createPortal(
            element,
            _dragEl,
          );
        }
        return element;
      }
      

    return(
        <Draggable 
            key={ `${ orientation }--${thisTrack.id}--${index}` } 
            draggableId={ `${ orientation }--${thisTrack.id}--${index}`} 
            index={ index }>
                {( provided, snapshot ) => (
                    optionalPortal( provided.draggableProps.style, (
                        <li
                        key={ `${ orientation }--${thisTrack.id}--${index}` } 
                        ref={provided.innerRef} 
                        style={ provided.draggableStyle }
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        className={ `activeItemTrack `} >
                            <div > 
                                <p className='activeItemTrack__title'>
                                    { thisTrack.name }
                                </p>
                                <p className='activeItemTrack__info'>
                                {                    
                                    thisTrack.artists.map(( artist, i ) => i === thisTrack.artists.length -1 ? `${artist.name}` : `${artist.name}, ` )
                                }
        
                                </p>
                            </div>
                            {
                                selected &&
                                <button
                                onPointerUp={ handleSelection } 
                                className={`activeItemTrack__btn activeItemTrack__btn--active`}><i className="fas fa-check"></i></button>
                            }
                            <i className="fas fa-bars"></i>
                            
                        </li>
                    ))
                )}
            
        </Draggable>
       
    )
}

export default ActiveItemTrack 