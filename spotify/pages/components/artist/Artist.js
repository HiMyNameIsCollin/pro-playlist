import { useEffect, useReducer , useState, useRef, useCallback, useContext } from 'react'
import { animated } from 'react-spring'
import TracksContainer from '../TracksContainer'
import AlbumContainer from '../AlbumContainer'
import ArtistHeader from './ArtistHeader'
import Slider from '../Slider'
import LoadingBubbles from '../LoadingBubbles'
import useApiCall from '../../hooks/useApiCall'
import { stopDupesId, stopDupesName } from '../../../utils/stopDupes'
import { DbHookContext, DbFetchedContext } from '../Dashboard'
import { SearchHookContext } from '../search/Search'
import { SearchPageSettingsContext } from '../search/Search'
import { HomePageSettingsContext } from '../Home'

const Artist = ({ style, page }) => {

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
                const arr = stopDupesId(state.albums, action.items, 'name')
                return {
                    ...state,
                    albums: arr.reduce(( acc, val ) => {
                       const found = acc.find( x => x.name === val.name )
                       if( !found ) acc = [ ... acc, val ]
                       return acc
                    },[]).filter( x => x.album_type === 'single' || x.album_group !== 'appears_on')
                }
            default: 
                return state
                break
        }
    }
    
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(  )
    const [ state , dispatch ] = useReducer(reducer, initialState)
    const [ headerMounted, setHeaderMounted ] = useState( undefined )
    const { user_info } = useContext( DbFetchedContext )
    const { artist , top_tracks, albums, related_artists } = { ...state }
    const { activeHomeItem, setActiveHomeItem, dashboardRef } = useContext( DbHookContext )
    const searchContext = useContext( SearchHookContext )
    const activeItem = searchContext ? searchContext.activeSearchItem : activeHomeItem
    const setActiveItem = searchContext ? searchContext.setActiveSearchItem : setActiveHomeItem
    const { setTransMinHeight , transitionComplete } = useContext( page==='search' ? SearchPageSettingsContext : HomePageSettingsContext)

    const thisComponentRef = useRef() 
    const firstMountRef = useRef() 

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
        if( headerMounted ) thisComponentRef.current.classList.add('fadeIn')
    }, [ headerMounted ])

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[ apiPayload ])

    const handleGoBack = ( e ) => {
        e.stopPropagation()
        setActiveItem( {} )
    }

    return(
        <animated.div ref={ thisComponent } style={ style } className={ `page page--artist artist` }>
        {
            !headerMounted ?
            <LoadingBubbles /> :
            headerMounted === 'error' &&
            <div className='mountError' style={{ top: dashboardRef.current.scrollTop }}>
                <p>
                    Something went wrong
                </p>
                <button onClick={ handleGoBack }>
                    Go back
                </button>
            </div>
        }
        {
            artist.id &&
            <ArtistHeader 
            pageType={ searchContext ? 'search' : 'home'}
            data={{ artist }}  
            setHeaderMounted={ setHeaderMounted }/>
        }

            <TracksContainer type='artist' data={ {collection: null, tracks: top_tracks, artist: artist} }/>
            <AlbumContainer page={ searchContext ? 'search' : 'home' } albums={ albums } />
            <Slider 
            message='Fans also enjoy'
            items={ related_artists }
            setActiveItem={ setActiveItem } />
        </animated.div>
    )
}

export default Artist