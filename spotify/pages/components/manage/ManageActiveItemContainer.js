import { useState, useEffect, useContext, useReducer } from 'react'
import { animated, useTransition } from 'react-spring'
import { ManageHookContext } from './Manage'
import useApiCall from '../../hooks/useApiCall'

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



const ManageActiveItemContainer = () => {



    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { activeManageItem } = useContext( ManageHookContext )
    const [ tracks, setTracks ] = useState([])

    const routes = {
        tracks: activeManageItem.type === 'album' ? 'v1/albums/tracks' : 'v1/playlists/tracks',
    }

    const itemContainerTrans = useTransition( activeManageItem, {
        initial: { transform: 'translateY( 100% )' },
        from: { transform: 'translateY( 100% )' },
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( 100% )' }
    })

    useEffect(() => {
        if(apiPayload) console.log( apiPayload )
    }, [ apiPayload ])

    useEffect(() => {
        if(activeManageItem){
            if( Array.isArray( activeManageItem.tracks ) ){
                setTracks( activeManageItem.tracks )
            }else {
                let tracksRoute = routes.tracks.substr( 0, routes.tracks.length - 6 )
                tracksRoute += activeManageItem.id
                tracksRoute += '/tracks'
                finalizeRoute( 'get', tracksRoute, activeManageItem.id, null )
            }
        }
        
    },[ activeManageItem ])

    return(

        
        itemContainerTrans(( props, item ) => (
            item.id &&
            <animated.div style={ props } className='mngActiveItemContainer'>
                Test
            </animated.div>
        ))
    
            
      
    )
}

export default ManageActiveItemContainer