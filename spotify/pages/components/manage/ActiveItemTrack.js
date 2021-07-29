import { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'

const ActiveItemTrack = ({ track, index, selectedItems, setSelectedItems }) => {

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

    return(
        <Draggable key={ thisTrack.id } draggableId={ thisTrack.id } index={ index }>
            {provided => (
                <li
                ref={provided.innerRef} 
                {...provided.draggableProps} 
                {...provided.dragHandleProps}
                onPointerUp={ handleSelection }
                className={ `activeItemTrack activeItemTrack--${'placeholder'}`}>
                <div className={`activeItemTrack__title`}> 
                    <h5>
                        { thisTrack.name }
                    </h5>
                    <p>
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
                
            </li>
            )}
            
        </Draggable>
       
    )
}

export default ActiveItemTrack 