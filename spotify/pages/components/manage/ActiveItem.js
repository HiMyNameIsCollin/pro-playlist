import { useState, useEffect, useContext, useRef, useReducer } from 'react'
import { animated } from 'react-spring'
import ActiveItemTrack from './ActiveItemTrack'
import useApiCall from '../../hooks/useApiCall'
import { whichPicture } from '../../../utils/whichPicture'
import Slider from '../Slider'
import { ManageHookContext } from './Manage'
import { DbFetchedContext } from '../Dashboard'
import { Droppable } from 'react-beautiful-dnd'
const ActiveItem = ({ orientation, dragging, style, data, setActiveItem }) => {

    const routes = {
        artist: 'v1/artists',
        items: data.type === 'album' ? 
        'v1/albums/tracks' :
        data.type === 'playlist' ?
        'v1/playlists/tracks' :
        'v1/artists/albums'
    }
    const initialState = {
        items: [],
        artist: {}
    }
    
    const reducer = ( state, action ) => {
        let route
        let method
        if(action){
            route = action.route
            method = action.method
        }
        console.log(action)
        switch(route) {
            case routes.artist:
                if( method === 'get'){
                    return{
                        ...state,
                        artist: action
                    }
                }
            case routes.items:
                if( method==='get'){
                    return{
                        ...state,
                        items: [ ...state.items, ...action.items ]
                    }
                }
        }
    }
    


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const [ state, dispatch ] = useReducer(reducer, initialState)
    const currentActiveItemRef = useRef({})
    const [ selectedItems, setSelectedItems ] = useState( [] )
    const [ disabled, setDisabled ] = useState( false )
    const [ image, setImage ] = useState()

    const { items, artist } = { ...state }
    const { user_info } = useContext( DbFetchedContext )

    useEffect(() => {
        if(dragging){
            if( orientation === 'bottom' && 
            !data.collaborative &&
            !data.owner ||
            data.owner && data.owner.display_name !== user_info.display_name ||
            data.name === 'Liked Tracks' ||
            data.name === 'To be added'){
                setDisabled(true)
            }
        } else {
            if( disabled ) setDisabled( false )
        }
    }, [ dragging ])

    useEffect(() => {
        if(artist.images) setImage( whichPicture( artist.images, 'sm' ) )
    }, [ artist ])

    useEffect(() => {
        if(data.type !== 'sortPlaylist'  ){
            if( data.images ){
                setImage( whichPicture( data.images, 'sm' ) )
            } else {
                console.log( data )
                finalizeRoute( 'get', data.href.substring( API.length ), data.id, null ) 
            }
        }
        
    }, [data])


    useEffect(() => {
        if( data.id ){
            if( currentActiveItemRef.current ){
                if( data.id !== currentActiveItemRef.current.id ){
                    const payload = {
                        items: [],
                        route: routes.items,
                        method: 'get'
                    }
                    dispatch(payload)        
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
                const payload = {
                    items: data.items,
                    route: routes.items,
                    method: 'get'
                }
                dispatch(payload)
            }else {
                let itemsRoute = routes.items.substr( 0, routes.items.length - 6 )
                itemsRoute += data.id
                itemsRoute += data.type === 'artist' ? '/albums' : '/tracks'
                finalizeRoute( 'get', itemsRoute, data.id, null, 'limit=50' )
            }
        }
    },[ data ])

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    }, [ apiPayload ])

    
    return(

        <animated.div style={ style } className={`activeItem activeItem--${ orientation }  ${ disabled && 'activeItem__itemContainer--disabled'} `}>
        {
            data.type === 'sortPlaylist' &&
            <div className={`activeItem__itemContainer activeItem__itemContainer--full`}>
                <div className='activeItem__itemContainer__scroll' style={{ overflowY: 'hidden'}}>
                    <Slider message={ 'Your playlists' } items={items} setActiveItem={ setActiveItem }/>
                </div>
            </div>
        }
        {
            data.type !== 'sortPlaylist' &&
            <>
            <div className={`activeItem__imgContainer activeItem__imgContainer--${ orientation }`}>
                <img src={ image } alt={ `${data.name} image`} />
            </div>
            <div className={`activeItem__meta activeItem__meta--${ orientation }`}>
                <h4> { data.name } </h4>
                <div>
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
                        data.type === ' artist' ?
                        items.length > 1 ? ' releases' : ' release'  :
                        items.length > 1 ? ' tracks' : ' track'  
                    }
                </span>

                }
                </div>
            </div>
            <div 
            className={`activeItem__itemContainer activeItem__itemContainer--${ orientation }`}>
                {
                    data.type === 'artist' ?
                    <div className='activeItem__itemContainer__scroll'>

                        <Slider message={ `Releases by ${ data.name }` } items={items} setActiveItem={ setActiveItem }/>
                    </div>
                    :
                    <Droppable droppableId={ orientation }>
                        { provided => (
                            <ul className={ `activeItem__itemContainer__scroll activeItem__itemContainer__scroll--${ orientation } `} {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                items.map(( item, i ) => (
                                        <ActiveItemTrack 
                                        track={ item } 
                                        key={ item.id }
                                        index={ i }
                                        selectedItems={ selectedItems }
                                        setSelectedItems={ setSelectedItems }/>
                                ))
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