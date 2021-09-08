import { useState, useEffect, useContext, useRef } from 'react'
import { animated } from 'react-spring'
import ActiveItemTrack from './ActiveItemTrack'
import Slider from '../Slider'
import useApiCall from '../../hooks/useApiCall'
import { whichPicture } from '../../../utils/whichPicture'
import { stopDupesId } from '../../../utils/stopDupes'
import { DbFetchedContext } from '../Dashboard'
import { Droppable } from 'react-beautiful-dnd'
import Image from 'next/image'

const ActiveItem = ({ orientation, dragging, style, data, setActiveItem, items, setItems, clickLoc, setClickLoc, originalItemsRef }) => {

    const routes = {
        artist: 'v1/artists',
        items: data.type === 'album' ? 
        'v1/albums/tracks' :
        data.type === 'playlist' ?
        'v1/playlists/tracks' :
        'v1/artists/albums'
    }

    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(  )
    const currentActiveItemRef = useRef({})
    const [ revealed, setRevealed ] = useState( 10 )
    const [ image, setImage ] = useState()
    const [ disabled, setDisabled ] = useState( false )
    const { user_info } = useContext( DbFetchedContext )

    useEffect(() => {
        if( data.images || data.href ){
            if( data.images ){
                setImage( whichPicture( data.images, 'sm' ) )
            } else {
                const api = 'https://api.spotify.com/'
                finalizeRoute( 'get', data.href.substring( api.length ), data.id, {fetchAll: true }, null,  'limit=50' ) 
            }
        }
        
    }, [data])

    useEffect(() => {
        if(apiPayload) {
            if( apiPayload.route === routes.artist ){
                setImage( whichPicture( apiPayload.images, 'sm' ))
            } else if ( apiPayload.route === routes.items ){
                let payloadItems 
                if( apiPayload.items[0] && apiPayload.items[0].track ){
                    payloadItems = apiPayload.items.map( item => item.track)
                } else {
                    payloadItems = apiPayload.items
                }
                let result = []
                if( data.type !== 'artist' ){
                    result = [ ...items, ...payloadItems ]
                } else {
                    result = [...items, ...payloadItems].reduce(( acc, val ) =>{
                        const found = acc.find( x => x.name === val.name )
                        if( !found ) acc.push( val )
                        return acc
                    },[])
                }
                setItems( result )
                const ids = result.map(( item, i ) => `${ orientation }--${ item.id }` )
                originalItemsRef.current = [ ...originalItemsRef.current , ...ids ]
            }
        }
    }, [ apiPayload ])

    useEffect(() => {
        if( data.id ){
            if( currentActiveItemRef.current ){
                if( data.id !== currentActiveItemRef.current.id ){
                    setItems( [] )     
                }
            } else {
                currentActiveItemRef.current = data
            }        
        } else {
            currentActiveItemRef.current = {}
        }
    }, [ data ])

    useEffect(() => {
        if(data.type){
            if( Array.isArray( data.items ) ){
                let theseItems
                if( data.items[0].track){
                    theseItems = data.items.map( item => item.track)
                } else {
                    theseItems = data.items
                }
                setItems( theseItems )
                originalItemsRef.current = theseItems.map( ( item, i ) => `${ orientation }--${ item.id }` )
            }else {
                let itemsRoute = routes.items.substr( 0, routes.items.length - 6 )
                itemsRoute += data.id
                itemsRoute += data.type === 'artist' ? '/albums' : '/tracks'
                finalizeRoute( 'get', itemsRoute, data.id, { fetchAll: true }, null, 'limit=50', 'include_groups=album,single' )
            }
        }
    },[ data ])

    useEffect(() => {
        if( dragging ) {
            if( orientation === 'bottom' ){
                if(( data.id === '1' || data.id === '2' ) ) setDisabled( true )
                if( !data.collaborative && 
                    data.owner &&
                    data.owner.display_name !== user_info.display_name ||
                    data.type !== 'playlist') setDisabled( true )
            } else {
                if( data.type === 'sortPlaylist'){
                    setDisabled( true )
                }
            }
        }else {
            setDisabled( false )
        }
        
    }, [ dragging ])

    const handleReveal = ( e ) => {
        const scrollHeight = e.target.scrollHeight 
        if( e.target.scrollTop >= scrollHeight * .25  ) {
            const toReveal = items.length - revealed 
            setRevealed( toReveal < 10 && toReveal > 0 ? revealed + toReveal : revealed + 10 ) 
        }
    }

    return(
        <animated.div style={ style } className={`activeItem activeItem--${ orientation } ${ disabled && `activeItem--disabled`}`}>
        {
            data.type === 'sortPlaylist' &&
            <div className={`activeItem__itemContainer activeItem__itemContainer--full`}>
                <div className='activeItem__itemContainer__scroll' style={{ overflowY: 'hidden'}}>
                    <Slider sortEnabled message={ 'Your playlists' } items={items} setActiveItem={ setActiveItem }/>
                </div>
            </div>
        }
        {
            data.type !== 'sortPlaylist' &&
            <>
            <div className={`activeItem__imgContainer activeItem__imgContainer--${ orientation }`}>
                {
                    image ?
                    <img src={ image } alt={ `${data.name} image`} /> :
                    <Image
                    loading='lazy'
                    alt={ `Spotify logo placeholder`}
                    layout='fill'
                    objectFit='contain'
                    src='/Spotify_Icon_RGB_Green.png'/>
                }
                
            </div>
            <div className={`activeItem__meta activeItem__meta--${ orientation }`}>
                <p className='activeItem__title'> { data.name } </p>
                <div className='activeItem__info'>
                {
                    data.type !== 'artist' ?
                    data.artists ?
                    <span onClick={ () => setActiveItem( data.artists[0]) }> 
                        { data.artists[0].name }
                    </span> :
                    <span>
                        { data.owner.display_name }
                    </span> :
                    null
                }
                
                {
                items.length > 0 &&
                <span> 
                    { items.length } 
                    {
                        data.type === 'artist' ?
                        items.length > 1 ? ' releases' : ' release'  :
                        items.length > 1 ? ' tracks' : ' track'  
                    }
                </span>

                }
                </div>
            </div>
            <div 
            onScroll={ handleReveal } 
            className={`activeItem__itemContainer activeItem__itemContainer--${ orientation }`}>
                {
                    data.type === 'artist' ?
                    <div className='activeItem__itemContainer__scroll'>
                        <Slider message={ `Releases by ${ data.name }` } items={items} setActiveItem={ setActiveItem }/>
                    </div>
                    :
                    <Droppable 
                    isDropDisabled={ disabled ? true : false}
                    droppableId={ `${ orientation }--${ data.id }` }>
                        { provided => (
                            <ul className={ `activeItem__itemContainer__scroll activeItem__itemContainer__scroll--${ orientation } `} {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                items.slice(0, revealed ).map(( item, i ) => {
                                    if( item.type !== 'album' ){
                                        if( data.type === 'album'){
                                            item['images'] = data.images
                                        }
                                        if(!item.images){
                                            item['images'] = item.album.images
                                        }
                                    }
                                    const added = !originalItemsRef.current.includes( `${ orientation }--${ item.id }` ) ? true : false 
                                    
                                    return(
                                    <ActiveItemTrack 
                                    images={ data.type !== 'playlist' ? data.images : undefined}
                                    added={ added }
                                    orientation={ orientation }
                                    track={ item } 
                                    dragging={ dragging }
                                    key={ `${ orientation }--${ item.id }--${i}` } 
                                    dragId={ `${ orientation }--${ item.id  }--${i}` }
                                    index={ i }
                                    originalItemsRef={ originalItemsRef }
                                    clickLoc={ clickLoc }
                                    setClickLoc={ setClickLoc }/>
                                    )
                                })
                                    
                                
                            }
                            {provided.placeholder}
                            </ul>
                        )}
                        
                    </Droppable>
                }


            </div>
            </>
        }
                

        </animated.div>
    )
}

export default ActiveItem