
import { useState, useEffect, useContext } from 'react'
import { useTransition, animated, useSpring } from 'react-spring'
import useApiCall from '../hooks/useApiCall'
import ItemMenu from './selectOverlay/ItemMenu'
import { DbHookContext } from './Dashboard'

const SelectOverlay = ({ dbDispatch }) => {
    
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { selectOverlay, setSelectOverlay, setMessageOverlay} = useContext( DbHookContext )

    const [ data , setData ] = useState( [] )

    const alterPlaylistRoute = 'v1/playlists'
    const allPlaylistsRoute = 'v1/me/playlists'

    useEffect(() => {
        if( selectOverlay.type === 'playlists'){
            finalizeRoute( 'get', allPlaylistsRoute, null, { fetchAll: true, limit: null }, 'limit=50' )
        } else if( selectOverlay.type === 'albums'){
            setData( selectOverlay.data )
        } else if ( selectOverlay.type === 'recPlayed'){
            setData( selectOverlay.data )
        } else if( !selectOverlay.type ) setData([])
    }, [ selectOverlay ])

    useEffect(() => {
        if(apiPayload){
            if( apiPayload.method === 'get' ){
                setData( apiPayload.items )
                dbDispatch( apiPayload )
            } else if( apiPayload.method === 'post') {
                const modified = data.find( x => x.id === apiPayload.id )
                // setMessageOverlay({ message: `Added to ${ modified.name }`, active: true })
            }
        }
    },[ apiPayload ])


    const handleClose = () => {
        setSelectOverlay( {} )
    }

    const handlePlaylist = ( playlist ) => {
        const args = selectOverlay.data.map( item =>  item.uri )
        finalizeRoute('post', `${alterPlaylistRoute}/${playlist.id}/tracks`, playlist.id, null,  `uris=${args[0]}`, ...args )
    }

    const overlayTypeTrans = useTransition( selectOverlay, {
        from: { transform: 'translateY(100%)' },
        enter: { transform: 'translateY(0%)' },
        leave: { transform: 'translateY(100%)'}
    })

    const activeOverlay = useSpring({
        pointerEvents: selectOverlay.type ? 'auto' : 'none',
        opacity: selectOverlay.type ? 1 : 0
    })
    

    return(

            <animated.div
            style={ activeOverlay }
            className='overlay'>
            {
                overlayTypeTrans(( props, item ) => (
                    item.type &&
                    
                    <ItemMenu 
                    type={ item.type }
                    handleClose={ handleClose }
                    handlePlaylist={ handlePlaylist }
                    page={ item.page }
                    style={ props }
                    items={ data }/>
                ))
            }
            </animated.div>
       
    )
}

export default SelectOverlay 