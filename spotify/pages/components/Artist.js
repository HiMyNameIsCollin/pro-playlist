import { useState, useEffect, useReducer } from 'react'
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
    const { artist } = { ...state }
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
        </div>
    )
}

export default Artist