import { useEffect, useState, useCallback, useContext } from 'react'
import { animated, useSpring } from 'react-spring'
import useApiCall from '../../hooks/useApiCall'
import { DbFetchedContext, DbHookContext } from '../Dashboard'
import SelectOverlayHeader from './SelectOverlayHeader'

const NewPlaylistForm = ({  menuData, pos }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { user_info, my_top_tracks, my_liked_tracks } = useContext( DbFetchedContext )
    const { selectOverlay, setSelectOverlay } = useContext( DbHookContext )

    const [ input, setInput ] = useState( menuData.data ? menuData.data[0].name : 'New playlist')

    const createPlaylistRoute = `v1/users/${ user_info.id }/playlists`

    const newPlaylistInputRef = useCallback( node => {
        if(node && window.innerWidth >= 1024 ) node.select()
    },[])

    const spawnTrackRecommendations = ( item ) => {
        const menu = { type: 'trackRecommendations' , page: item.page, data: item.data, context: item.context } 
        setSelectOverlay( selectOverlay => selectOverlay = [ ...selectOverlay, menu ])
    }

    const shrink = useSpring({
        transform: pos >= selectOverlay.length - 1 ? 'scaleX(1.00) scaleY(1.00)' : 'scaleX(0.90) scaleY(0.97)' ,
        borderRadius: pos >= selectOverlay.length - 1  ? '0px' : '20px',
        minHeight: pos >= selectOverlay.length - 1 ? '85vh' : '100vh'
    })

    const handleCreatePlaylist = () => {

    }


    return(
        <animated.div style={ shrink } className='selectOverlay__menu' >
            <SelectOverlayHeader menuData={ menuData }/>
            <form  className='newPlaylistForm'>
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