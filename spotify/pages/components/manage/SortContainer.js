import { useState, useEffect, useContext, useReducer, useRef } from 'react'
import { animated, useTransition, useSpring } from 'react-spring'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { DbFetchedContext } from '../Dashboard'
import { ManageHookContext } from './Manage'
import useApiCall from '../../hooks/useApiCall'
import ActiveItem from './ActiveItem'
import ResizeBar from './ResizeBar'

const initialState = {
    tracks: []
}

const reducer = ( state, action ) => {
    let route
    let method
    if(action){
        route = action.route
        method = action.method
    }
}



const SortContainer = ({ style }) => {


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { activeManageItem, setActiveManageItem } = useContext( ManageHookContext )
    const { my_playlists, user_info } = useContext( DbFetchedContext )
    const [ activePlaylistItem, setActivePlaylistItem ] = useState({})

    const [ resizePos, setResizePos ] = useState()
    const sortContainerRef = useRef()


    useEffect(() => {
        if(activeManageItem.type){
            if( !activePlaylistItem.type) setActivePlaylistItem({ type:'sortPlaylist', id:'playlistSort', items: my_playlists.slice().filter( x => x.owner.display_name === user_info.display_name || x.collaborative ) })
        } else {
            setActivePlaylistItem( {} )
        }
    }, [ activeManageItem ])

    const handleCloseSortContainer = () => {
        setActivePlaylistItem( {} )
        setActiveManageItem( {} )
    }

    const activeItemTrans = useTransition( activeManageItem, {
        initial: { transform: 'translateY( 100% )', marginTop: 'auto', width: '100%'},
        from: { transform: 'translateY( 100% )', marginTop: 'auto' },
        update: { position: 'relative' } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( 100% )' , position: 'absolute', bottom: 0 }
    })

    const playlistTrans = useTransition( activePlaylistItem, {
        initial: { transform: 'translateY( -100% )', width: '100%' },
        from: { transform: 'translateY( -100% )' },
        update: { position: 'relative' } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( -100% )', position: 'absolute', top: 0 }
    })

    const dragEnd = () => {

    }

    return(  
        <animated.div style={ style } className='sortContainer'>
        <DragDropContext onDragEnd={ dragEnd } >
            <div 
            ref={ sortContainerRef }
            className='sortContainer__relative'>
        {
            playlistTrans(( props, item) => (
                item.type &&
                <ActiveItem orientation={ 'top '} style={ props } data={ item } setActiveItem={ setActivePlaylistItem } />
            ))
        }
            <ResizeBar sortContainerRef={ sortContainerRef.current } resizePos={ resizePos } setResizePos={ setResizePos } />
        {
        activeItemTrans(( props, item ) => (
            item.type &&
            <ActiveItem style={ props } data={ item } setActiveItem={ setActiveManageItem } />
        ))
        }
            </div>
        </DragDropContext>
        </animated.div>
    )
}

export default SortContainer