import { useState, useEffect, useReducer, useRef, useLayoutEffect, createContext } from 'react'
import { calcScroll } from '../../utils/calcScroll'
import  useApiCall  from '../hooks/useApiCall'
import Home from './Home'
import Manage from './manage/Manage'
import Search from './search/Search'

import Overlay from './Overlay'
import Nav from './Nav'
import Player from './player/Player'

export const DbHookContext = createContext()
export const DbFetchedContext = createContext()

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

const initialPageScroll = {
    home: 0,
    search: 0,
    manage: 0
}
const Dashboard = ({ setAuth, audioRef }) => {

    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const [ state, dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState( false )
    const [ scrollPosition, setScrollPosition ] = useState(0)
    const [ overlay, setOverlay ] = useState({})
    const [ hiddenUI, setHiddenUI ] = useState( false )
// activeHeader contains the data from the active page required for certain headers to function
    const [ queue, setQueue ] = useState( [] )
    const [ qIndex, setQIndex ] = useState()
    const [ playNextQueue, setPlayNextQueue ] = useState([])
    const [ dashboardState, setDashboardState ] = useState('home')
    const [ searchState, setSearchState ] = useState('default')
    const [ playerSize, setPlayerSize ] = useState( 'small' )

    const [ activeSearchItem, setActiveSearchItem ] = useState( {} )
    const [ activeHomeItem, setActiveHomeItem ] = useState( {} ) 
    const [ homeTransMinHeight, setHomeTransMinHeight ] = useState( 0 )
    const [ searchTransMinHeight, setSearchTransMinHeight ] = useState( 0 )

    const dashboardRef = useRef()
    const pageScrollRef = useRef( initialPageScroll )
    const currActiveHomeRef = useRef( {} )
    const currActiveSearchRef = useRef( {} )
    const searchPageHistoryRef = useRef( [] )
    const homePageHistoryRef = useRef( [] )
    const scrollRef = useRef( scrollPosition )
    const firstMountRef = useRef()

    const { user_info, player_info, my_top_genres, my_playlists, featured_playlists, new_releases, my_albums, recently_played, my_top_tracks, my_top_artists, all_categories, available_genre_seeds } = { ...state }

// Context set up //////////////////////////////////////////////////

    const dbHookState = {
        audioRef,
        homePageHistoryRef,
        searchPageHistoryRef,
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
        hiddenUI,
        setHiddenUI,
        loaded, 
        setLoaded,
        setAuth,
        dashboardRef,
        dashboardState
    }

    const dbFetchedState = {
        user_info,
        player_info,
        my_top_genres,
        my_playlists, 
        featured_playlists, 
        new_releases, 
        my_albums, 
        recently_played, 
        my_top_tracks, 
        my_top_artists, 
        all_categories, 
        available_genre_seeds 
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

    useEffect(() => {
        if( dashboardState !== 'home' ){
            if( activeHomeItem.id ) setDashboardState( 'home' )
        }
    }, [ activeHomeItem ])


// HANDLE SCROLL PERCENTAGE 

    const handleScroll = () => {
        if(dashboardRef.current){
            const percent = calcScroll()
            setScrollPosition( percent ? percent : 0)
        }
    }

// API CALLS 
    useEffect(() => {
        // First four arguments in 'finalizeRoute' are 
        // Method of fetch
        // Route of fetch (From the routes object)
        // The ID of the request (The id of the JSON im referencing like calls for albums tracks)
        // 4th and onwards arguments will add query params to final url (Limit, offset, etc)
        finalizeRoute('get', routes.user_info, null)
        finalizeRoute( 'get', routes.player_info, null)
        finalizeRoute( 'get', routes.featured_playlists, null )
        finalizeRoute( 'get', routes.new_releases, null )
        finalizeRoute( 'get', routes.my_albums, null, 'limit=50')
        finalizeRoute( 'get', routes.my_playlists, null, 'limit=50')
        finalizeRoute( 'get', routes.recently_played, null, 'limit=50' ) 
        finalizeRoute( 'get', routes.new_releases, null )
        finalizeRoute( 'get', routes.available_genre_seeds, null )
        finalizeRoute( 'get', routes.my_top_tracks, null )
        finalizeRoute( 'get', routes.my_top_artists, null )
        finalizeRoute ('get', routes.followed_artists, null, 'type=artist')
    },[])
    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[apiPayload])
//  END OF API CALLS 
 
    useEffect(() => {
        firstMountRef.current = true
    },[])

//  When overlay is open, makes the rest of the APP no clicky
    useLayoutEffect(() => {
        const body = document.querySelector('body')
        if( overlay.type || playerSize === 'large' ) {
            body.classList.add('noScroll')
        } else{
            body.classList.remove('noScroll')
        }
        if( searchState === 'search' && dashboardState === 'search' ){
            body.classList.add( 'noScroll' )
        } else if (searchState === 'search' && dashboardState !=='search'){
            body.classList.remove( 'noScroll' )
        }
    }, [ overlay, playerSize, searchState, dashboardState ])

    useEffect(() => {
        if( activeSearchItem.id || activeHomeItem.id ){
            setSearchState('default')
        }
    
    }, [ activeSearchItem, activeHomeItem ])

    useEffect(() => {
        let hideMe
        if(scrollPosition <= scrollRef.current) {
            hideMe = false
        } else {
            hideMe = true
        }
        if (scrollPosition === 100 || scrollPosition < 1){
            hideMe = false
        }
        setHiddenUI( hideMe )
        scrollRef.current = scrollPosition
    }, [ scrollPosition ])

    useEffect(() => {
        const homePage = document.getElementById('homePage')
        const searchPage = document.getElementById('searchPage')
        const managePage = document.getElementById('managePage')
        const pages = [ homePage, searchPage, managePage ]
        if( homePage && searchPage && managePage ) {
            pages.forEach( page => page.style.display = 'none')
            if( dashboardState === 'home' ) {
                homePage.style.display = 'block'
                window.scroll({ 
                    top: pageScrollRef.current.home, 
                    left: 0,
                    behavior: 'auto'
                })
            }
            if( dashboardState === 'search' ) {
                searchPage.style.display = 'block'
                window.scroll({ 
                    top: pageScrollRef.current.search, 
                    left: 0,
                    behavior: 'auto'
                })
            }
            if( dashboardState === 'manage' ) {
                managePage.style.display = 'block'
                window.scroll({ 
                    top: pageScrollRef.current.manage, 
                    left: 0,
                    behavior: 'auto'
                })
            }
        }
        
        // DASHBOARD STATE NEEDS TO BE SET AS DEPENDENCY ONCE IM DONE MANAGE PAGE
    },[ dashboardState ])

    useEffect(() => {
        if(dashboardState === 'home') dashboardRef.current.scroll({top: pageScrollRef.current[dashboardState]})
        if(dashboardState === 'search') dashboardRef.current.scroll({top: pageScrollRef.current[dashboardState]})
    }, [ dashboardState ])


    return(
        <DbHookContext.Provider value={ dbHookState }>
        <DbFetchedContext.Provider value={ dbFetchedState }>
            <section
            ref={ dashboardRef }
            onScroll={ handleScroll }
            className={ `dashboard`}>  

                <Overlay />

                <Home
                transMinHeight={ homeTransMinHeight }
                setTransMinHeight={ setHomeTransMinHeight }
                currActiveHomeRef={ currActiveHomeRef }
                state={ state } 
                homePageHistoryRef={ homePageHistoryRef }/> 

                <Search
                transMinHeight={ searchTransMinHeight }
                setTransMinHeight={ setSearchTransMinHeight }
                activeSearchItem={ activeSearchItem }
                setActiveSearchItem={ setActiveSearchItem }
                searchState={ searchState }
                setSearchState={ setSearchState }
                my_top_artists={ state.my_top_artists } 
                available_genre_seeds={ state.available_genre_seeds }
                searchPageHistoryRef={ searchPageHistoryRef }
                currActiveSearchRef={ currActiveSearchRef } />

                <Manage />
                
                <Player 
                hiddenUI={ hiddenUI } 
                playerSize={ playerSize } 
                setPlayerSize={ setPlayerSize }/>

                <Nav 
                dashboardRef={ dashboardRef }
                homeTransMinHeight={ homeTransMinHeight }
                searchTransMinHeight={ searchTransMinHeight }
                dashboardRef={ dashboardRef }
                pageScrollRef= { pageScrollRef }
                hiddenUI={ hiddenUI } 
                scrollPosition={ scrollPosition }
                activeHomeItem={ activeHomeItem }
                activeSearchItem={ activeSearchItem }
                setActiveHomeItem={ setActiveHomeItem }
                setActiveSearchItem={ setActiveSearchItem }
                dashboardState={ dashboardState }
                setDashboardState={ setDashboardState } />
            </section>
        </DbFetchedContext.Provider>
        </DbHookContext.Provider>  
    )
}
export default Dashboard