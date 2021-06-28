import { useState, useEffect, useReducer, useRef, useLayoutEffect, createContext } from 'react'
import { Switch, Route, useLocation, useHistory, NavLink } from 'react-router-dom'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { calcScroll } from '../../utils/calcScroll'
import { useTransition, animated } from 'react-spring'
import  useApiCall  from '../hooks/useApiCall'
import HomeHeader from './HomeHeader'
import SearchHeader from './SearchHeader'
import FixedHeader from './FixedHeader'
import Home from './Home'
import Manage from './Manage'
import Search from './Search'

import Overlay from './Overlay'
import Nav from './Nav'
import Player from './player/Player'

export const DbHookContext = createContext()

const initialState = {
    user_info: {},
    player_info: {},
    my_top_genres: [],
    my_playlists: [],
    featured_playlists: [],
    new_releases: [],
    my_albums: [],
    recently_played: [],
    my_top_tracks: [],
    my_top_artists: [],
    all_categories: [],
    available_genre_seeds: [],
}

const routes = {   
    user_info: 'v1/me',
    player_info: 'v1/me/player',
    recently_played: 'v1/me/player/recently-played',
    my_playlists: 'v1/me/playlists',
    featured_playlists: 'v1/browse/featured-playlists',
    all_categories: 'v1/browse/categories',
    my_albums: 'v1/me/albums',
    recommendations: 'v1/recommendations',
    my_top_tracks: 'v1/me/top/tracks',
    my_top_artists: 'v1/me/top/artists',
    featured_playlists: 'v1/browse/featured-playlists',
    new_releases: 'v1/browse/new-releases',
    available_genre_seeds: 'v1/recommendations/available-genre-seeds',
    followed_artists: 'v1/me/following',
}

const reducer = (state, action) => {
    let route
    let method
    if(action){
        route = action.route
        method = action.method
    }
    switch(route) {
        case routes.user_info:
            if(method === 'get'){
                return{
                    ...state,
                    user_info: action
                }
            }
        case routes.player_info:
            console.log(action)
            if(method==='get'){
                return{
                    ...state,
                    player_info: action
                }
            }
        case routes.my_playlists:
            if(method === 'get'){
                return{
                    ...state,
                    my_playlists: action.items
                }
            }
        case routes.my_albums:
            if(method === 'get'){
                return{
                    ...state,
                    my_albums: action.items
                }
            }
        case routes.recently_played:
            if(method === 'get'){
                return{
                    ...state,
                    recently_played: action.items
                }
            }             
        case routes.new_releases:
            if(method === 'get'){
                return{
                    ...state,
                    new_releases: action.albums.items
                }
            }
        case routes.featured_playlists:
            if(method === 'get'){
                return{
                    ...state,
                    featured_playlists: action.playlists.items
                }  
            }  
        case routes.recommendations:
            if(method === 'get'){
                return{
                    ...state,
                    recommendations: action.items
                }
            }
        case routes.available_genre_seeds:
            if(method === 'get'){
                return{
                    ...state,
                    available_genre_seeds: action.genres
                }
            }
        case routes.my_top_tracks:
            if(method === 'get'){
                return{
                    ...state,
                    my_top_tracks: action.items
                }
            }
        case routes.my_top_artists:
            if(method === 'get'){
                return{
                    ...state,
                    my_top_artists: action.items
                }
            } 
        case routes.followed_artists:
            return{
                ...state,
                followed_artists: action.artists.items
            }

        default:
            console.log(action)
            break         
    }
}
const Dashboard = ({ setAuth, audioRef }) => {
    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const location = useLocation()
    const history = useHistory()
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const [ state, dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState( false )
    const [ scrollPosition, setScrollPosition ] = useState(0)
    const [ overlay, setOverlay ] = useState({})
    const [ hiddenUI, setHiddenUI ] = useState( false )
// activeHeader contains the data from the active page required for certain headers to function
    const [ activeHomeItem, setActiveHomeItem ] = useState( {}) 
    const [ queue, setQueue ] = useState( [] )
    const [ qIndex, setQIndex ] = useState()
    const [ playNextQueue, setPlayNextQueue ] = useState([])
    const [ dashboardState, setDashboardState ] = useState('home')
    const searchPageHistoryRef = useRef( [] )

    const scrollRef = useRef( scrollPosition )

    const { user_info, player_info, my_top_genres, my_playlists, featured_playlists, new_releases, my_albums, recently_played, my_top_tracks, my_top_artists, all_categories, available_genre_seeds } = { ...state }

// Context set up //////////////////////////////////////////////////

    const dbHookState = {
        audioRef,
        activeHomeItem, 
        setActiveHomeItem, 
        overlay, 
        setOverlay,  
        scrollPosition, 
        queue,
        setQueue,
        qIndex,
        setQIndex,
        playNextQueue,
        setPlayNextQueue,
        location,
        hiddenUI,
        setHiddenUI,
        loaded, 
        setLoaded,
        setAuth
     }

// Set last played track on account as active track
    useEffect(() => {
        if( !queue[0] ){
            let firstTracks = null
            // if( player_info.item ){
            //     firstTrack = player_info.item
            //     firstTrack['context'] = {
            //         href: player_info.context.href,
            //         type: player_info.context.type
            //     }
            // }
            if( recently_played[0] ){
                firstTracks = [ ...recently_played ]
                firstTracks = firstTracks.map(( t ) => {
                    t.track['context'] = {
                        name: 'Recently played',
                        type: t.context ? t.context.type : null,
                        href: t.context ? t.context.href : null
                    }  
                    return t.track
                })
            } 
            if (firstTracks) {
                setQIndex(0)
                setQueue( queue => queue = [ ...firstTracks ])
            }
        }
        
}, [ recently_played, player_info  ])


// HANDLE SCROLL PERCENTAGE 
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    },[])

    const handleScroll = () => {
        const percent = calcScroll()
        setScrollPosition( percent ? percent : 0)
    }

// API CALLS 
    useEffect(() => {
        // First four arguments in 'finalizeRoute' are 
        // Method of fetch
        // Route of fetch (From the routes object)
        // Callback function from fetchHook
        // The ID of the request (The id of the JSON im referencing like calls for albums tracks)
        // 5th and onwards arguments will add query params to final url (Limit, offset, etc)
        finalizeRoute('get', routes.user_info, fetchApi, null)
        finalizeRoute( 'get', routes.player_info, fetchApi, null)
        finalizeRoute( 'get', routes.featured_playlists, fetchApi, null )
        finalizeRoute( 'get', routes.new_releases, fetchApi, null )
        finalizeRoute( 'get', routes.recently_played, fetchApi, null, 'limit=50' ) 
        finalizeRoute( 'get', routes.new_releases, fetchApi, null )
        finalizeRoute( 'get', routes.available_genre_seeds, fetchApi, null )
        finalizeRoute( 'get', routes.my_top_tracks, fetchApi, null )
        finalizeRoute( 'get', routes.my_top_artists, fetchApi, null )
        finalizeRoute ('get', routes.followed_artists, fetchApi, null, 'type=artist')
    },[])
    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[apiPayload])
//  END OF API CALLS 
 

// Navigation through the pages is handled here.
// When a dynamic page is selected(Playlist, Album, Artist), it will be set as the activeItem state, which fires this.
// Also clears the activeHeader state (Holds the data corresponding with the currently opened page.)

    useEffect(() => {
        if(activeHomeItem.type){
            switch(activeHomeItem.type){
                case 'artist':
                    if(location.pathname !== `/artist/${activeHomeItem.id}`){
                        history.push(`/artist/${activeHomeItem.id}`)
                    }
                    break
                case 'album':
                    if(location.pathname !== `/album/${activeHomeItem.id}`){
                        history.push(`/album/${activeHomeItem.id}`)
                    }
                    
                    break
                case 'playlist':
                    if(location.pathname !== `/playlist/${activeHomeItem.id}`){
                        history.push(`/playlist/${activeHomeItem.id}`)
                    }
                    break
                default:
                    
                    break
            }
        }
    },[ activeHomeItem ])

// Reset activeItem to null, otherwise you cant access same page twice in a row.
    useEffect(() => {
        handleScroll()
        // setActiveHomeItem({})
    }, [ location.pathname ] )

//  When overlay is open, makes the rest of the APP no clicky
    useLayoutEffect(() => {
        const body = document.querySelector('body')
        if( overlay.type ) {
            body.classList.add('noScroll')
        } else{
            body.classList.remove('noScroll')
        }
    }, [overlay])

    useEffect(() => {
        let hideMe
        console.log( scrollPosition < scrollRef.current )
        if(scrollPosition <= scrollRef.current) {
            hideMe = false
        } else {
            hideMe = true
        }
        if (scrollPosition === 100 ){
            hideMe = false
        }
        setHiddenUI( hideMe )
        scrollRef.current = scrollPosition
    }, [ scrollPosition ])


//  NAVIGATION TRANSITIONS
    const pageTransition = useTransition(location, {
        initial: { transform: 'translateX(100%)', },
        from: { transform: 'translateX(100%)', position: 'absolute', width: '100%'},
        update: {  position: 'relative'},
        enter: { transform: 'translateX(0%)' },
        leave: { transform: 'translateX(-20%)', position: 'absolute'},

    })

    const headerTransition = useTransition(location, {
        initial: { transform: 'translateX(100%)', height: 'auto', opacity: 0, position: 'fixed', width: '100%', zIndex: 2},
        from: { height: 'auto', opacity: 0, position: 'fixed', transform: 'translateX(100%)', width: '100%', zIndex: 2},
        update: {  position: 'fixed'},
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: { position: 'fixed', transform: 'translateX(-100%)', zIndex: -1 },
    })

    return(
        <DbHookContext.Provider value={ dbHookState }>
            <section className='dashboard'>  
                <Overlay />
            {
                dashboardState === 'home' &&
                <Home state={ state } /> 
            }
            {
                dashboardState === 'search' &&
                <Search
                my_top_artists={ state.my_top_artists } 
                available_genre_seeds={ state.available_genre_seeds }
                searchPageHistoryRef={ searchPageHistoryRef }/>
            }
            {
                dashboardState === 'manage' &&
                <Manage /> 
            }
                
            
                <Player hiddenUI={ hiddenUI }/>
                <Nav hiddenUI={ hiddenUI } setDashboardState={ setDashboardState } />
            </section>  
        </DbHookContext.Provider>  
    )
}
export default Dashboard