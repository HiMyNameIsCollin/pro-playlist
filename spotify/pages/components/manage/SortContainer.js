import { useState, useEffect, useContext, useReducer, useRef } from 'react'
import { animated, useTransition, useSpring } from 'react-spring'
import { DbFetchedContext } from '../Dashboard'
import { ManageHookContext } from './Manage'
import useApiCall from '../../hooks/useApiCall'
import ActiveItem from './ActiveItem'
import PlaylistContainer from './PlaylistContainer'

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



const SortContainer = () => {


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { activeManageItem } = useContext( ManageHookContext )
    const { my_playlists } = useContext( DbFetchedContext )
    
    const sortContainerTrans = useSpring({
        pointerEvents: activeManageItem.type ? 'auto' : 'none'
    })

    const sortContainerActiveItemTrans = useTransition( activeManageItem, {
        initial: { transform: 'translateY( 100% )' },
        from: { transform: 'translateY( 100% )' },
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( 100% )' }
    })

    const sortContainerPlaylistTrans = useTransition( activeManageItem, {
        initial: { transform: 'translateY( -100% )' },
        from: { transform: 'translateY( -100% )' },
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( -100% )' }
    })

    return(  
        <animated.div style={ sortContainerTrans } className='sortContainer'>
        {
        sortContainerPlaylistTrans(( props, item ) => (
            item.type &&
            <PlaylistContainer style={ props } data={ my_playlists } />
        ))
        }
        {
        sortContainerActiveItemTrans(( props, item ) => (
            item.type &&
            <ActiveItem style={ props } data={ item } />
        ))
        }
        </animated.div>
    )
}

export default SortContainer