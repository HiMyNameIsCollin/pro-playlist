import { useState, useEffect, useReducer , useLayoutEffect} from 'react'
import TracksContainer from './TracksContainer'
import useApiCall from '../../hooks/useApiCall'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { whichPicture } from '../../utils/whichPicture'

const Artist = ({ item, setActiveItem, setActiveHeader, overlay, setOverlay, headerMounted, genreSeeds, location }) => {

    const initialState = {
        artist: null,
        top_tracks: null
    }

    const routes = {
        artist: 'v1/artists',
        top_tracks: 'v1/artists/top-tracks'
    }

    const reducer = ( state, action ) => {
        let route
        let method
        if(action){
            route = action.route
            method = action.method 
        }
        switch(route){
            case routes.artist :
                return{
                    ...state,
                    artist: action
                }
            case routes.top_tracks :
                return{
                    ...state,
                    top_tracks: action.tracks
                }
                default: 
                console.log(action)
                break
        }

    }

    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState(false)
    const [ elementHeight, setElementHeight ] = useState(null)
    const { artist , top_tracks } = { ...state }


    useEffect(() => {
        let id = item && item.id ? item.id : location.pathname.substr( routes.artist.length - 2 )
        finalizeRoute( 'get', `${routes.artist}/${id}`, fetchApi, id)
        finalizeRoute( 'get', `${routes.artist}/${id}/top-tracks`, fetchApi, id, `market=ES`)
    }, [])

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[ apiPayload ])

    useEffect(() => {
        if(artist && !item) setActiveItem(artist)
    },[ artist ])

    useLayoutEffect(() => {
        if(artist){
            const thisHeader = document.querySelector('.artistHeader')
            document.documentElement.style.setProperty('--headerHeight', thisHeader.offsetHeight + 'px')
            setElementHeight(thisHeader.offsetHeight)
    
            return () => {
                document.documentElement.style.setProperty('--headerColor0', 'initial')
                document.documentElement.style.setProperty('--headerColor1', 'initial')
            }
        }
    }, [artist])

    return(
        <div className={ `page page--artist artist ${ overlay ? 'page--blurred' : ''}` }>
            {
                artist &&
                <header className='artistHeader'>
                    <div className='artistHeader__imgContainer'>
                        <img 
                        src={ whichPicture(artist.images, 'lrg') }
                        alt='Artist'
                        /> 
                    </div>
                    <h1> {artist.name} </h1>
                </header>
            }
            {
                top_tracks &&
                <TracksContainer type='artist' data={ {collection: null, tracks: top_tracks} } setOverlay={ setOverlay }/>
            }
        </div>
    )
}

export default Artist