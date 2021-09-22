
import { useCallback, useRef, useEffect, useState, useReducer, useContext } from 'react'
import { animated } from 'react-spring'
import  useApiCall  from '../../hooks/useApiCall'
import CollectionHeader from './CollectionHeader'
import CollectionMeta from './CollectionMeta'
import TracksContainer from '../TracksContainer'
import Slider from '../Slider'
import LoadingBubbles from '../LoadingBubbles'
import { getSeeds } from '../../../utils/getSeeds'
import { DbHookContext, DbFetchedContext } from '../Dashboard'
import { SearchHookContext } from '../search/Search'
import { SearchPageSettingsContext } from '../search/Search'
import { HomePageSettingsContext } from '../Home'

const Collection = ({ style, type, page, data }) => {
    
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
                    artists: state.artists = [...state.artists, action ] 
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
                    tracks: state.tracks = [...state.tracks, ...songs]
                }
            case routes.recommendations :
                const recommendations = action.tracks.map(track => track.album)
                return {
                    ...state,
                    recommendations: recommendations
                }
            default:
                return state
                break
        }
    }

    // ENV VARIABLE FOR API?
    const { finalizeRoute , apiError, apiIsPending, apiPayload, setApiPayload  } = useApiCall( )
    const [ state , dispatch ] = useReducer(reducer, initialState)
    
    const [ headerMounted, setHeaderMounted ] = useState( undefined )

    const { setOverlay, activeHomeItem, setActiveHomeItem, selectOverlay, setSelectOverlay, dashboardRef, tracksAddedToPlaylistRef } = useContext( DbHookContext )
    const { available_genre_seeds, user_info } = useContext( DbFetchedContext )
    const searchContext = useContext( SearchHookContext )
    const activeItem = searchContext ? searchContext.activeSearchItem : activeHomeItem
    const setActiveItem = searchContext ? searchContext.setActiveSearchItem : setActiveHomeItem
    const { setTransMinHeight, transitionComplete ,} = useContext( page==='search' ? SearchPageSettingsContext : HomePageSettingsContext)
    
    const { collection, artists, tracks, recommendations } = {...state}

    const thisComponentRef = useRef() 
    const selectedTrackRef = useRef()

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
        if( headerMounted ){
            if( selectedTrackRef.current ){
                // Scrolls track into view if selected from home page tab
                const ele = document.querySelector(`[data-trackId='${ selectedTrackRef.current }']`)
                if(ele){
                    const thisFar = ele.getBoundingClientRect().top + window.pageYOffset + -80
                    dashboardRef.current.scrollTo({ left: 0, top: thisFar, behavior: 'smooth' })
                }
            }
            setTimeout(() => {
                thisComponentRef.current.classList.add('fadeIn')
            }, 500)
        }
    },[ headerMounted ])

    useEffect(() => {
        let id = data.id
        if( data.selectedTrack ) selectedTrackRef.current = activeItem.selectedTrack
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
        if(apiPayload) {
            dispatch( apiPayload )
        }
    }, [apiPayload])

    useEffect(() => {
        if( collection.id ) {
            let tracksRoute = routes.tracks.substr( 0, routes.tracks.length - 6 )
            tracksRoute += `${collection.id}`
            tracksRoute += '/tracks'
            finalizeRoute( 'get', tracksRoute , collection.id, {fetchAll: true}, null, 'limit=50' )
        } 
    }, [ collection ])

    useEffect(() => {
        if( collection.id && !selectOverlay[ 0 ] && tracksAddedToPlaylistRef.current[0]) {
            
            let newTracks = {}
            newTracks['route'] = routes.tracks
            newTracks['items'] = tracksAddedToPlaylistRef.current
            tracksAddedToPlaylistRef.current = [] 
            dispatch( newTracks )
        } 
    }, [ collection, selectOverlay ])

    useEffect(() => {
        if( type === 'album' && 
            collection.id && 
            artists[0] && 
            tracks[0] && 
            !recommendations[0] &&
            user_info.country ){
            let seeds = getSeeds(available_genre_seeds, artists, tracks)
            finalizeRoute( 'get', `${routes.recommendations}`,  null, null,  null, ...seeds )

        }
    }, [ collection, artists, tracks ])

    const handleGetRecommendationsBtn = () => {
        const overlay = { page: searchContext? 'search' : 'home', type: 'trackRecommendations', data: tracks, context: collection }
        setSelectOverlay( arr => arr = [ ...arr, overlay])
    }

    const handleGoBack = ( e ) => {
        e.stopPropagation()
        setActiveItem( {} )
    }

    return(
        <animated.div
        ref={ thisComponent } 
        style={ style } 
        className={ `page page--collection collection` }>
        {
            !headerMounted ?
            <LoadingBubbles /> :
            headerMounted === 'error' &&
            <div style={{ top: dashboardRef.current.scrollTop }} className='mountError'>
                <p>
                    Something went wrong
                </p>
                <button onClick={ handleGoBack }>
                    Go back
                </button>
            </div>
        }
        {
            collection.id&&
            <>
            <CollectionHeader
            pageType={ searchContext ? 'search' : 'home'}
            setActiveItem={ setActiveItem }
            data={{collection, tracks, artists,}}
            setHeaderMounted={ setHeaderMounted }
            parent={ thisComponentRef } />

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
            {
            type === 'playlist' && user_info.display_name === collection.owner.display_name && 
                <button onClick={ handleGetRecommendationsBtn } className='collection__addBtn'>
                    Get recommendations
                </button>
            }
            </>            
        }
        
        </animated.div>
    )
}

export default Collection