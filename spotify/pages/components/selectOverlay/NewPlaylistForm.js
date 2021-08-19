import { useEffect, useState, useCallback, useContext } from 'react'
import useApiCall from '../../hooks/useApiCall'
import { DbFetchedContext } from '../Dashboard'
const NewPlaylistForm = ({ menuData, newPlaylistRef, handleClose }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { user_info } = useContext( DbFetchedContext )
    const [ input, setInput ] = useState(menuData.data[0].name)

    const newPlaylistInputRef = useCallback( node => {
        if(node) node.select()
    },[])

    const newPlaylistRoute = `v1/users/${user_info.id}/playlists`
    const alterPlaylistRoute = 'v1/playlists/tracks'

    useEffect(() => {
        if( apiPayload ){

            if( apiPayload.route === newPlaylistRoute ){
                finalizeRoute('post', `${ alterPlaylistRoute.slice( 0, 12 ) }/${apiPayload.id}/tracks`, apiPayload.id, null, null,  `uris=${menuData.data[0].uri}` )
                newPlaylistRef.current = { ...apiPayload, page: menuData.page}
            } else if( apiPayload.route === alterPlaylistRoute ){
                handleClose()
            }
        }
    }, [ apiPayload ])

    const handleCreatePlaylist = (e) => {
        e.preventDefault()
        const body = {
            "name": input !== '' ? input :  menuData.data[0].name,
            "description": "Description for playlist",
            "public": true
        }
        finalizeRoute('post', newPlaylistRoute, null, null, body )
    }

    return(
        <form onSubmit={ handleCreatePlaylist } className='selectOverlay__newPlaylistForm'>
            <label forHtml='newPlaylistInput'> Give your playlist a name. </label>
            <input 
            onClick={ (e) => {
                e.target.select()
            }}
            ref={ newPlaylistInputRef }
            onChange={ (e) => setInput( e.value )} 
            type='text' 
            name='newPlaylistInput' 
            value={ input }/>
            <button onSubmit={ handleCreatePlaylist } className='selectOverlay__newBtn'> 
                Create 
            </button>
        </form>
    )
}

export default NewPlaylistForm 