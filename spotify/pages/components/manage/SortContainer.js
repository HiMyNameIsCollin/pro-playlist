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



const SortContainer = ({ style }) => {


    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { activeManageItem, setActiveManageItem } = useContext( ManageHookContext )
    const { my_playlists } = useContext( DbFetchedContext )
    const [ playlistContainerData, setPlaylistContainerData ] = useState( undefined )

    useEffect(() => {
        if(activeManageItem.type ){
            if( !playlistContainerData ) setPlaylistContainerData( { id: 'test', items: my_playlists } )
            
        } else {
            setPlaylistContainerData( undefined )
        }
    }, [ activeManageItem ])
    


    const activeItemTrans = useTransition( activeManageItem, {
        initial: { transform: 'translateY( 100% )' },
        from: { transform: 'translateY( 100% )' },
        update: { position: 'relative' } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( 100% )' , position: 'absolute', bottom: 0  }
    })

    const playlistTrans = useTransition( playlistContainerData, {
        initial: { transform: 'translateY( -100% )' },
        from: { transform: 'translateY( -100% )' },
        update: { position: 'relative' } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( -100% )', position: 'absolute', top: 0 }
    })

    return(  
        <animated.div onClick={ () => setActiveManageItem( {} ) } style={ style } className='sortContainer'>
        {
        playlistTrans(( props, item ) => (
            item.id &&
            <PlaylistContainer 
            style={ props } 
            data={ item } 
            setData={ setPlaylistContainerData } />
        ))
        }
        {
        activeItemTrans(( props, item ) => (
            item.type &&
            <ActiveItem style={ props } data={ item } />
        ))
        }
        </animated.div>
    )
}

export default SortContainer