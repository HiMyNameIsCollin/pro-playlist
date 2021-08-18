import { useState, useEffect, useReducer , useRef, useCallback, useContext} from 'react'
import { animated } from 'react-spring'
import TracksContainer from './TracksContainer'
import Loading from './Loading'
import AlbumContainer from './AlbumContainer'
import ArtistHeader from './ArtistHeader'
import Slider from './Slider'
import useApiCall from '../hooks/useApiCall'
import { DbHookContext } from './Dashboard'
import { DbFetchedContext } from './Dashboard'
import { SearchHookContext } from './search/Search'
const Artist = ({ setTransMinHeight, transitionComplete, setTransitionComplete, transition, headerScrolled, setHeaderScrolled, activeHeader, setActiveHeader }) => {


    const {  overlay, setOverlay, activeHomeItem, setActiveHomeItem, setSearchOverlay } = useContext( DbHookContext )
    const { user_info } = useContext( DbFetchedContext )
    const searchContext = useContext( SearchHookContext )
    const activeItem = searchContext ? searchContext.activeSearchItem : activeHomeItem
    const setActiveItem = searchContext ? searchContext.setActiveSearchItem : setActiveHomeItem

    const initialState = {
        artist: {},
        top_tracks: [],
        albums: [],
        follow: false,
        related_artists: []
    }

    const routes = {
        artist: 'v1/artists',
        albums: 'v1/artists/albums',
        following: 'v1/me/following/contains',
        related_artists: 'v1/artists/related-artists' ,
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
                return {
                    ...state,
                    artist: action
                }
            case routes.top_tracks :
                console.log(action)
                return {
                    ...state,
                    top_tracks: action.tracks
                }
            case routes.following :
                return {
                    ...state,
                    following: action[0]
                }
            case routes.related_artists:
                return{
                    ...state,
                    related_artists: action.artists
                }
            case routes.albums:
                return {
                    ...state,
                    albums: [ ...state.albums, ...action.items ]
                }
            default: 
                console.log(action)
                break
        }
    }
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state , dispatch ] = useReducer(reducer, initialState)

    const { artist , top_tracks, albums, related_artists } = { ...state }
    
    const thisComponentRef = useRef() 

    const [ mounted, setMounted ] = useState(false)

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
        if( transitionComplete ) {
            thisComponentRef.current.classList.add('fadeIn')
            setMounted( true )
        }
    }, [ transitionComplete ])

    useEffect(() => {
        if(mounted) thisComponentRef.current.style.minHeight = '100vh'
    },[ mounted ])



    useEffect(() => {
        if( user_info.country ){
            const market = user_info.country
            const id = activeItem.id
            finalizeRoute( 'get', `${routes.artist}/${id}`, id, null, null,`market=${market}` )
            finalizeRoute( 'get', `${routes.artist}/${id}/top-tracks`, id, null, null, `market=${market}` )
            finalizeRoute( 'get', `${routes.artist}/${id}/albums`, id, { fetchAll: true, limit: null }, null, 'limit=50', `market=${market}`)
            finalizeRoute( 'get', `${routes.artist}/${id}/related-artists`, id, null, null, 'limit=50', `market=${market}`)
        }
    }, [ user_info])

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[ apiPayload ])



    return(
        <animated.div ref={ thisComponent } style={ transition } className={ `page page--artist artist ` }>
            {
                artist.id &&
                <ArtistHeader 
                pageType={ searchContext ? 'search' : 'home'}
                headerScrolled={ headerScrolled }
                setHeaderScrolled={ setHeaderScrolled }
                activeHeader={ activeHeader }
                setActiveHeader={ setActiveHeader }
                data={{ artist }} 
                transitionComplete={ transitionComplete } 
                setTransitionComplete={ setTransitionComplete } />
            }

                
                <TracksContainer type='artist' data={ {collection: null, tracks: top_tracks, artist: artist} } setOverlay={ setOverlay }/>
                <AlbumContainer page={ searchContext ? 'search' : 'home' } albums={ albums } />
                <Slider 
                message='Fans also enjoy'
                items={ related_artists }
                setActiveItem={ setActiveItem } />
        
        </animated.div>
    )
}

export default Artist