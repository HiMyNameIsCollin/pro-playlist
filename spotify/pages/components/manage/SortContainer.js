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
    const { my_playlists, user_info } = useContext( DbFetchedContext )
    const [ activePlaylistItem, setActivePlaylistItem ] = useState({})

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
        initial: { transform: 'translateY( 100% )', paddingBottom: '3.6rem', marginTop: 'auto', overflow: 'hidden' },
        from: { transform: 'translateY( 100% )', paddingBottom: '3.6rem', marginTop: 'auto', overflow: 'hidden'  },
        update: { position: 'relative', overflow: 'auto' } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( 100% )' , position: 'absolute', bottom: 0, overflow: 'hidden'  }
    })

    const playlistTrans = useTransition( activePlaylistItem, {
        initial: { transform: 'translateY( -100% )', overflow: 'hidden' },
        from: { transform: 'translateY( -100% )' },
        update: { position: 'relative', overflow: 'auto' } ,
        enter: { transform: 'translateY( 0% )' },
        leave: { transform: 'translateY( -100% )', position: 'absolute', top: 0, overflow: 'hidden' }
    })

    return(  
        <animated.div onClick={ handleCloseSortContainer } style={ style } className='sortContainer'>
        {
            playlistTrans(( props, item) => (
                item.type &&
                <ActiveItem style={ props } data={ item } setActiveItem={ setActivePlaylistItem } />
            ))
        }
        {
        activeItemTrans(( props, item ) => (
            item.type &&
            <ActiveItem style={ props } data={ item } setActiveItem={ setActiveManageItem } />
        ))
        }
        </animated.div>
    )
}

export default SortContainer