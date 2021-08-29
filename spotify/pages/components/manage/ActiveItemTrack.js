import { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { createPortal } from 'react-dom'
import { useSpring, animated } from 'react-spring'
import { whichPicture } from '../../../utils/whichPicture'
import useApiCall from '../../hooks/useApiCall'


const ActiveItemTrack = ({track, index, dragId , dragging, added, clickLoc, setClickLoc, originalItemsRef }) => {


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const [ active, setActive ] = useState( added )
    const [ thisTrack, setThisTrack ] = useState( {} )
    
    useEffect(() => {
        if( !originalItemsRef.current.includes( track.id )){
            originalItemsRef.current.push( dragId.replace(`--${ index }`, '') )
        }
        
    },[])

    const whereIClick = ( e ) => {
        setClickLoc( e.clientX - (window.innerWidth / 5) )
    }

    useEffect(() => {
        if( dragging === dragId ){
            setActive( true )
        } else {
            if( active ) setActive( false )
        }
    }, [ dragging ])


     
    const { maxWidth, transform }  = useSpring({
        maxWidth: active ? '0%' : '100%' 
    })

    const activeItem = useSpring({
        left:  active ? clickLoc : 0 ,
        background: active ? '#191414' : '#212121' ,
        color: active ? '#1DB954' : '#FFFFFF' ,
        border: active ? 'solid #1DB954 1px' : 'solid #212121 0px' ,
        borderRadius: active ? '10px' : '0px',
        maxWidth: active ? window.innerWidth / 4 : window.innerWidth 
    })



    return(
        <Draggable 
            key={ dragId } 
            draggableId={ dragId } 
            index={ index }>
                {( provided, snapshot ) => (
                    <li
                    className='activeItemTrackContainer'
                    key={ dragId } 
                    ref={provided.innerRef} 
                    onPointerDown={ whereIClick }
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps}
                    style={ provided.draggableProps.style } >
                        <animated.div 
                        style={ activeItem }
                        className={ `activeItemTrack`}>
                            <div
                            className='activeItemTrack__imgContainer' >
                                
                                <img 
                                loading='lazy'
                                src={ whichPicture( track.images ) } /> 
                            </div>
                            <animated.div style={ maxWidth } className='activeItemTrack__meta'> 
                                <p className='activeItemTrack__title'>
                                    { track.name }
                                </p>
                                <p className='activeItemTrack__info'>
                                {                    
                                    track.artists && track.artists.map(( artist, i ) => i === track.artists.length -1 ? `${artist.name}` : `${artist.name}, ` )
                                }
        
                                </p>
                            </animated.div>
                            
                            <i className="fas fa-bars" />
                        </animated.div>
                        
                    </li>
                )}
            
        </Draggable>
       
    )
}

export default ActiveItemTrack 