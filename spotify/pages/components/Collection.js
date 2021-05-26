import { useState, useEffect, useReducer } from 'react'
import  useApiCall  from '../../hooks/useApiCall'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { whichPicture } from '../../utils/whichPicture'
import { handleViewArtist } from '../../utils/handleViewArtist'
import { calculateTotalDuration } from '../../utils/calculateTotalDuration'
import CollectionHeader from './collection/CollectionHeader'
import CollectionMeta from './collection/CollectionMeta'
import TracksContainer from './collection/TracksContainer'
import Slider from './Slider'
import Loading from './Loading'


const Collection = ({ type, item, setActiveItem, overlay, setOverlay, genreSeeds, location }) => {
    const initialState = {
        collection: item ? item : null ,
        tracks: null,
        artists: null,
        recommendations: null
    }
    
    const routes = {
        album: 'v1/albums',
        playlist: 'v1/playlists',
        tracks: type === 'album' ? 'v1/albums/tracks' : 'v1/playlists/tracks',
        artist: 'v1/artists',
        user: 'v1/users',
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
            case routes.playlist :
                return{
                    ...state,
                    collection: action
                }
            case routes.artist :
                let newState = {...state}
                newState.collection.artists.map((artist, i) => {
                    if(artist.id === action.id){
                        newState.collection.artists[i].images = action.images
                        newState.collection.artists[i].genres = action.genres
                    }
                })
                return{
                    ...state, 
                    collection: newState.collection,
                    artists: state.artists ? [...state.artists, action ] : [action]
                }
            case routes.user :
                return{
                    ...state,
                    artists: [action]
                }
            case routes.tracks :
                return{
                    ...state,
                    tracks: action.items
                }
            case routes.recommendations :
                const recommendations = action.tracks.map(track => track.album)
                return {
                    ...state,
                    recommendations: recommendations
                }
            default:
                console.log(action)
                break
        }
    }
    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState(false)

    const { collection, artists, tracks, recommendations } = {...state}

    useEffect(() => {
        if( !item ) {
            if(type === 'album'){
                const id = location.pathname.substr( routes.album.length - 2 )
                finalizeRoute( 'get', `${routes.album}/${id}`, fetchApi)
            } else if(type === 'playlist'){
                const id = location.pathname.substr( routes.playlist.length - 2 )
                finalizeRoute( 'get', `${routes.playlist}/${id}`, fetchApi)
            }
        }
    }, [])

    useEffect(() => {
        if(apiPayload) dispatch( apiPayload )
    }, [apiPayload])

    useEffect(() => {
        // Set background image of Album header
        if( collection ) document.documentElement.style.setProperty('--collectionBackground', `url(${whichPicture(collection.images, 'lrg')})`) 
    }, [collection])

    useEffect(() => {
        if( collection && !artists ){
            if(type === 'album'){
                collection.artists.map((artist, i) => {
                    finalizeRoute( 'get', `${routes.artist}/${artist.id}` , fetchApi , artist.id)
                })
            } else if (type === 'playlist'){
                finalizeRoute('get', `${routes.user}/${collection.owner.id}`, fetchApi , collection.owner.id)
            }
        } 
    }, [ collection ])


    useEffect(() => {
        if( collection && !tracks){
            let tracksRoute 
            if( type === 'album' ){
                tracksRoute = routes.tracks.substr( 0, routes.tracks.length - 7 )
            } else {
                tracksRoute = routes.playlist.substr( 0, routes.tracks.length - 7 )
            }
            tracksRoute += `/${collection.id}`
            tracksRoute += '/tracks'
            finalizeRoute( 'get', tracksRoute , fetchApi , collection.id)
        } 
    }, [ collection ])

    const getSeeds = ( genreSeeds , theseArtists, theseTracks ) => {
        let seeds = {
            seedGenres: [],
            seedArtists: [],
            seedTracks: []
        }
        let { seedGenres, seedArtists, seedTracks } = seeds
        theseArtists.forEach(( artist, i ) => {
            if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
                artist.genres.forEach(( genre, j ) => {
                    if(genreSeeds.includes( genre )){
                        seedGenres.push( genre )
                    }
                })
                seedArtists.push( artist.id )
            } 
        })
        theseTracks.forEach( track => {
            if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
                seedTracks.push( track.id )
            }
        })
        console.log(seeds)
        return seeds
    }
    
    useEffect(() => {
        if( collection && artists && tracks && !state.recommendations ){
            let seeds = getSeeds(genreSeeds, artists, tracks)
            const { seedGenres, seedArtists, seedTracks } = seeds
            finalizeRoute( 'get',
            `${routes.recommendations}`, 
            fetchApi, 
            null, 
            `seed_genres=${seedGenres.join()}`, 
            `seed_artists=${seedArtists.join()}`, 
            `seed_tracks=${seedTracks.join()}` )

        }
    }, [ collection, artists, tracks ])

    // If users first page is Album, fetch the data from here, and then set in the dashboard component.

    useEffect(() => {
        if( !item && collection ) setActiveItem( collection )
    }, [collection])

    const handleLoading = () => {
        setLoaded(true)
    }

    useEffect(()=> {
        if( collection && artists && tracks && recommendations ) handleLoading()
    },[state])

    return(
        <div className={ `page page--collection collection ${ overlay ? 'page--blurred' : ''}` }>
            <Loading loaded={ loaded }/>

            {
            loaded &&
            <>
                <CollectionHeader data={ state } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
                <TracksContainer data={ state } setOverlay={ setOverlay }/>
                <CollectionMeta data={ state } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
                <Slider message={'You may also enjoy: '} items={ recommendations } setActiveItem={ setActiveItem } />                
            </>
            }



        </div>
    )
}

export default Collection