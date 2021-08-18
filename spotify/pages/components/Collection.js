
import { useCallback, useRef, useEffect, useState, useReducer, useContext } from 'react'
import { animated } from 'react-spring'
import  useApiCall  from '../hooks/useApiCall'
import { whichPicture } from '../../utils/whichPicture'
import CollectionHeader from './CollectionHeader'
import CollectionMeta from './CollectionMeta'
import TracksContainer from './TracksContainer'
import Slider from './Slider'
import Loading from './Loading'
import { DbHookContext } from './Dashboard'
import { DbFetchedContext } from './Dashboard'
import { SearchHookContext } from './search/Search'


const Collection = ({ setTransMinHeight, transitionComplete, setTransitionComplete, transition, type, headerScrolled, setHeaderScrolled, activeHeader, setActiveHeader, }) => {
    

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
                // const allSongs = songs.filter( x => x.preview_url)
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
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)
    const {  overlay, setOverlay, activeHomeItem, setActiveHomeItem, dashboardRef  } = useContext( DbHookContext )
    const { available_genre_seeds, user_info } = useContext( DbFetchedContext )
    const searchContext = useContext( SearchHookContext )
    const { collection, artists, tracks, recommendations } = {...state}

    const activeItem = searchContext ? searchContext.activeSearchItem : activeHomeItem
    const setActiveItem = searchContext ? searchContext.setActiveSearchItem : setActiveHomeItem

    const thisComponentRef = useRef() 

    const thisComponent = useCallback(node => {
        if (node !== null) {
            const ro = new ResizeObserver( entries => {
                if( node.offsetHeight > 0 ) setTransMinHeight( node.offsetHeight )
            })
            ro.observe( node )
            thisComponentRef.current = node
            
            return () => ro.disconnect()
        }
      }, [])



    useEffect(() => {
        let id = activeItem.id
        finalizeRoute( 'get', `${ type === 'album' ? routes.album : routes.playlist}/${id}`, id)
    }, [])

    useEffect(() => {
        if( collection.id && !artists[0] ){
            if(type === 'album'){
                collection.artists.map((artist, i) =>{
                    finalizeRoute( 'get', `${routes.artist}/${artist.id}`  , artist.id)
                })
            } else if (type === 'playlist'){
                finalizeRoute('get', `${routes.user}/${collection.owner.id}` , collection.owner.id)
            }
        } 
    }, [ collection ])

    useEffect(() => {
        if(apiPayload) dispatch( apiPayload )
    }, [apiPayload])


    useEffect(() => {
        if( collection.id && !tracks[0]){
            let tracksRoute = routes.tracks.substr( 0, routes.tracks.length - 6 )
            tracksRoute += `${collection.id}`
            tracksRoute += '/tracks'
            finalizeRoute( 'get', tracksRoute , collection.id)
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
            artist.genres.forEach(( genre, j ) => {
                if(genreSeeds.includes( genre )){
                    if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
                    seedGenres.push( genre )
                    }
                }
            })
            if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
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
            !recommendations[0] &&
            user_info.country ){
            const market = user_info.country
            let seeds = getSeeds(available_genre_seeds, artists, tracks)
            const { seedGenres, seedArtists, seedTracks } = seeds
            let args = []
            if(seedGenres.length > 0) args.push( `seed_genres=${seedGenres.join()}` )
            if( seedArtists.length > 0 ) args.push(`seed_artists=${seedArtists.join()}` )
            if( seedTracks.length > 0 ) args.push( `seed_tracks=${seedTracks.join()}` )
            
            finalizeRoute( 'get',
            `${routes.recommendations}`, 
            null, 
            null,
            null,
            ...args )

        }
    }, [ collection, artists, tracks ])

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
        <animated.div
        ref={ thisComponent } 
        style={ transition } 
        className={ `page page--collection collection` }>
        {
            collection.id&&
            <>
            <CollectionHeader
            pageType={ searchContext ? 'search' : 'home'}
            headerScrolled={ headerScrolled }
            setHeaderScrolled={ setHeaderScrolled }
            setActiveItem={ setActiveItem }
            setActiveHeader={ setActiveHeader }
            data={{collection, tracks, artists,}}
            transitionComplete={ transitionComplete }
            setTransitionComplete={ setTransitionComplete }
            parent={ thisComponentRef.current } />
            <TracksContainer type='collection' data={ state } setOverlay={ setOverlay }/>
            {
            type === 'album' && 
                <>
                <CollectionMeta pageType={searchContext ? 'search': 'home' } data={ state } setOverlay={ setOverlay } setActiveItem={ setActiveItem } />
                <Slider message={'You may also enjoy: '} items={ recommendations } setActiveItem={ setActiveItem } />                
                <section className='collection__copyright'>
                        <p>{ collection.copyrights && collection.copyrights[0].text } </p>
                </section>
                </>
            }
            </>
        }
        </animated.div>
    )
}

export default Collection