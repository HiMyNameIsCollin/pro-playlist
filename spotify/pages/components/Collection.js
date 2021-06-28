
import { useState, useEffect, useReducer, useContext } from 'react'
import  useApiCall  from '../hooks/useApiCall'

import { finalizeRoute } from '../../utils/finalizeRoute'
import { whichPicture } from '../../utils/whichPicture'
import CollectionHeader from './CollectionHeader'
import CollectionMeta from './CollectionMeta'
import TracksContainer from './TracksContainer'
import Slider from './Slider'
import Loading from './Loading'
import { DbHookContext } from './Dashboard'
import { SearchHookContext } from './Search'


const Collection = ({ type, genreSeeds, headerScrolled, setHeaderScrolled, activeHeader, setActiveHeader, }) => {
    

    const initialState = {
        collection: {},
        tracks: [],
        artists: [],
        recommendations: []
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
                console.log(action)
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
                const songs = action.items.map((item) => {
                    if( item.track ) {
                        return item.track
                    } else {
                        return item
                    }
                })
                return{
                    ...state,
                    tracks: songs
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
    const {  overlay, setOverlay, location, activeHomeItem, setActiveHomeItem  } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext )
    const { collection, artists, tracks, recommendations } = {...state}

    const activeItem = searchContext ? searchContext.activeSearchItem : activeHomeItem
    const setActiveItem = searchContext ? searchContext.setActiveSearchItem : setActiveHomeItem

    useEffect(() => {
        if( !searchContext ){
            let id
            id = activeItem && activeItem.id ? 
            activeItem.id :
            type ==='album' ?
            location.pathname.substr( routes.album.length - 2 ) :
            location.pathname.substr( routes.playlist.length - 2 )
            finalizeRoute( 'get', `${ type === 'album' ? routes.album : routes.playlist}/${id}`, fetchApi, id)
    
        } else {
            let id = activeItem.id
            finalizeRoute( 'get', `${ type === 'album' ? routes.album : routes.playlist}/${id}`, fetchApi, id)
    
        }    
    }, [])

    useEffect(() => {
        if( collection.id && !artists[0] ){
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
        if(apiPayload) dispatch( apiPayload )
    }, [apiPayload])


    useEffect(() => {
        if( collection.id && !tracks[0]){
            let tracksRoute = type === 'album' ? 
            routes.tracks.substr( 0, routes.tracks.length - 7 ):
            tracksRoute = routes.playlist.substr( 0, routes.tracks.length - 7 )
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

        return seeds
    }
    
    useEffect(() => {
        if( type === 'album' && 
            collection.id && 
            artists[0] && 
            tracks[0] && 
            !recommendations[0] ){
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

    // If users first page is Collection, fetch the data from here, and then set in the dashboard component.

    useEffect(() => {
        if( !activeItem && collection.id ) setActiveItem( collection )
    }, [collection])


    useEffect(() => {
        if( activeItem.selectedTrack ){
            const ele = document.querySelector(`[data-trackId='${activeItem.selectedTrack}']`)
            if(ele){
                const thisFar = ele.getBoundingClientRect().top + window.pageYOffset + -80
                window.scroll(0, thisFar)
            }
        }
    },[ tracks ])

    return(
        <div className={ `page page--collection collection ${ overlay.type && 'page--blurred' }` }>
        {
            collection.id&&
            <>
            <CollectionHeader
            headerScrolled={ headerScrolled }
            setHeaderScrolled={ setHeaderScrolled }
            setActiveItem={ setActiveItem }
            setActiveHeader={ setActiveHeader }
            data={{collection, tracks, artists,}}/>
            <TracksContainer type='collection' data={ state } setOverlay={ setOverlay }/>
            {
            type === 'album' && 
                <>
                <CollectionMeta data={ state } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
                <Slider message={'You may also enjoy: '} items={ recommendations } setActiveItem={ setActiveItem } />                
                <section className='collection__copyright'>
                        <p>{ collection.copyrights && collection.copyrights[0].text } </p>
                </section>
                </>
            }
            </>
        }
        </div>
    )
}

export default Collection