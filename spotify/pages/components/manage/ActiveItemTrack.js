import { useState, useEffect } from 'react'

const ActiveItemTrack = ({ track, selectedItems, setSelectedItems }) => {

    const [ selected, setSelected ] = useState(false)

    useEffect(() => {
        if( selectedItems.includes( track.id )){
            setSelected( true )
        } else {
            setSelected( false )
        }
    }, [ selectedItems ])

    const handleSelection = () => {
        const trackId = track.track ? track.track.id : track.id
        if( selected ){
            setSelectedItems( items => items = items.filter( x=> x !== trackId ))
        } else {
            setSelectedItems( items => items = [ ...items, trackId ])
        }
    }

    return(
        <div
        onPointerUp={ handleSelection }
        className={ `activeItemTrack activeItemTrack--${'placeholder'}`}>
            <div className={`activeItemTrack__title`}> 
                <h5>
                    { track.name ? track.name : track.track.name }
                </h5>
                <p>
                {
                    track.artists&&
                    track.artists.map(( artist, i ) => i === track.artists.length -1 ? `${artist.name}` : `${artist.name}, ` )
                }
                {
                    track.track &&
                    track.track.artists.map(( artist, i ) => i === track.track.artists.length -1 ? `${artist.name}` : `${artist.name}, ` )
                }
                </p>
            </div>
            {
                selected &&
                <button
                onPointerUp={ handleSelection } 
                className={`activeItemTrack__btn activeItemTrack__btn--active`}><i className="fas fa-check"></i></button>
            }
            
        </div>
    )
}

export default ActiveItemTrack 