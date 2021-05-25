import { useState, useEffect, useReducer } from 'react'
import  useApiCall  from '../../hooks/useApiCall'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { whichPicture } from '../../utils/whichPicture'
import { handleViewArtist } from '../../utils/handleViewArtist'
import { calculateTotalDuration } from '../../utils/calculateTotalDuration'
import CollectionHeader from './collection/CollectionHeader'
import CollectionMeta from './collection/CollectionMeta'
import TracksContainer from './collection/TracksContainer'
import Loading from './Loading'

const routes = {
    album: 'v1/albums',
    tracks: 'v1/albums/tracks',
    main_artist: 'v1/artists',
    recommendations: 'v1/recommendations'
}

const reducer = (state, action) => {
    let route
    let method
    if(action){
        route = action.route
        method = action.method 
    }
    switch(route){
        case routes.album :
            return{
                ...state, 
                collection: action
            }
        case routes.main_artist :
            return{
                ...state, 
                main_artist: action
            }
        case routes.tracks :
            return{
                ...state,
                tracks: action.items
            }
        case routes.recommendations :
            return {
                ...state,
                recommendations: action
            }
        default:
            console.log(action)
            break
    }
}

const Collection = ({ type, item, setActiveItem, overlay, setOverlay, location }) => {
    const initialState = {
        collection: item ? item : null ,
        tracks: null,
        main_artist: null,
        recommendations: null
    }
    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState(false)

    const { collection, main_artist, tracks } = {...state}

    useEffect(() => {
        if( !item ) {
            if(type === 'album'){
                const id = location.pathname.substr(7)
                finalizeRoute( 'get', `${routes.album}/${id}`, fetchApi)
            }
        }
    }, [])

    useEffect(() => {
        // Set background image of Album header
        if( collection ) document.documentElement.style.setProperty('--collectionBackground', `url(${whichPicture(collection.images, 'lrg')})`) 
    }, [collection])

    useEffect(() => {
        if( collection && !state.main_artist){
            finalizeRoute( 'get', `${routes.main_artist}/${collection.artists[0].id}` , fetchApi , collection.artists[0].id)
        } 
    }, [ collection ])


    useEffect(() => {
        if( collection && !state.tracks){
            let tracksRoute = routes.tracks.substr( 0, routes.tracks.length - 7 )
            tracksRoute += `/${collection.id}`
            tracksRoute += '/tracks'
            console.log(tracksRoute)
            finalizeRoute( 'get', tracksRoute , fetchApi , collection.id)
        } 
    }, [ collection ])

    useEffect(() => {
        if( collection && !state.recommendations ){
            let recommendationRoute = routes.recommendations

        }
    }, [ collection ])

    useEffect(() => {
        if(apiPayload) dispatch( apiPayload )
    }, [apiPayload])

    // If users first page is Album, fetch the data from here, and then set in the dashboard component.

    useEffect(() => {
        if( !item && collection ) setActiveItem( collection )
    }, [collection])

    const handleLoading = () => {
        setLoaded(true)
    }

    useEffect(()=> {
        if( collection && main_artist && tracks) handleLoading()
    },[state])





    return(
        <div className={ `page page--collection collection ${ overlay ? 'page--blurred' : ''}` }>
            <Loading loaded={ loaded }/>

            {
                loaded &&
                <>
                    <CollectionHeader data={ state } />
                    <TracksContainer data={ state } setOverlay={ setOverlay }/>
                    <CollectionMeta data={ state } />
                </>
            }



        </div>
    )
}

export default Collection