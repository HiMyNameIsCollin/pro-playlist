import { useEffect, useState, useCallback, useContext } from 'react'
import { animated, useSpring } from 'react-spring'
import useApiCall from '../../hooks/useApiCall'
import { DbFetchedContext, DbHookContext } from '../Dashboard'
import SelectOverlayHeader from './SelectOverlayHeader'

const NewPlaylistForm = ({  menuData, pos, newPlaylistRef }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { selectOverlay, setSelectOverlay, refresh } = useContext( DbHookContext )

    const { user_info, my_top_tracks, my_liked_tracks } = useContext( DbFetchedContext )

    const [ input, setInput ] = useState( menuData.data ? menuData.data[0].name : 'New playlist')

    const newPlaylistRoute = `v1/users/${user_info.id}/playlists`
    const addToPlaylistRoute = 'v1/playlists/tracks'

    const newPlaylistInputRef = useCallback( node => {
        if(node && window.innerWidth >= 1024 ) node.select()
    },[])

    useEffect(() => {
        if( apiPayload ){
            if( apiPayload.route === newPlaylistRoute ){
                newPlaylistRef.current = { ...apiPayload, page: menuData.page }
                refresh('my_playlists')
                if(menuData.data){
                    finalizeRoute('post', `${ addToPlaylistRoute.substr(0, 12) }/${ apiPayload.id }/tracks`, apiPayload.id, null, null, `uris=${ menuData.data[0].uri }`)
                    
                } else {
                    spawnTrackRecommendations( apiPayload )
                }
            } else if( apiPayload.route === addToPlaylistRoute ){
                handleClose()
            }
        }
    },[ apiPayload ])

    useEffect(() => {
        if ( selectOverlay.length === 1  && newPlaylistRef.current.id ){
            setTimeout( handleClose, 500 )
        }
    },[ selectOverlay ])

    const handleClose = () => {
        setSelectOverlay( selectOverlay => selectOverlay = selectOverlay.slice(0, selectOverlay.length - 1) )
    }

    const spawnTrackRecommendations = ( context ) => {
        const menu = { type: 'trackRecommendations' , page: menuData.page, data: menuData.data, context: context } 
        setSelectOverlay( selectOverlay => selectOverlay = [ ...selectOverlay, menu ])
    }

    const handleCreatePlaylist = (e) => {
        e.preventDefault()
        const body = {
            name: input,
            description: 'Playlist created in Pro Playlist',
            public: true
        }
        finalizeRoute('post', newPlaylistRoute, null, null, body )
    }

    const shrink = useSpring({
        transform: pos >= selectOverlay.length - 1 ? 'scaleX(1.00) scaleY(1.00)' : 'scaleX(0.90) scaleY(0.97)' ,
        borderRadius: pos >= selectOverlay.length - 1  ? '0px' : '20px',
        minHeight: pos >= selectOverlay.length - 1 ? '85vh' : '100vh'
    })

    return(
        <animated.div style={ shrink } className='selectOverlay__menu' >
            <SelectOverlayHeader menuData={ menuData }/>
            <form onSubmit={ handleCreatePlaylist} className='newPlaylistForm'>
                <label forHtml='newPlaylistFormInput'> Give your playlist a name. </label>
                <textarea 
                onClick={ (e) => {
                    e.target.select()
                }}
                ref={ newPlaylistInputRef }
                onChange={ (e) => setInput( e.value )} 
                name='newPlaylistFormInput' 
                value={ input }/>
                <button className='newPlaylistForm__newBtn'> 
                    Create 
                </button>
            </form>
        </animated.div>
        
    )
}

export default NewPlaylistForm 