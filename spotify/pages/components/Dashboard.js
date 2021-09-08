import { useState, useEffect, useReducer, useRef, useLayoutEffect, createContext } from 'react'
import { useSpring, animated, useTransition } from 'react-spring'
import { calcScroll } from '../../utils/calcScroll'
import { stopDupesId } from '../../utils/stopDupes'
import useApiCall from '../hooks/useApiCall'
import Home from './Home'
import Manage from './manage/Manage'
import Search from './search/Search'
import Overlay from './overlay/Overlay'
import MessageOverlay from './MessageOverlay'
import SelectOverlay from './selectOverlay/SelectOverlay'
import Nav from './Nav'
import Player from './player/Player'

export const DbHookContext = createContext()
export const DbFetchedContext = createContext()

const initialState = {
    user_info: {},
    player_info: {},
    my_liked_tracks: [],
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
    followed_artists: [],
    my_top_categories: []
}

const routes = {   
    user_info: 'v1/me',
    player_info: 'v1/me/player',
    my_liked_tracks: 'v1/me/tracks',
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
    // My reducer is based off a set 'Route' string attached during the fetch process,
    // I set the top genre state with a makeshift 'my_top_genres' "route". 
    // Hopefully Spotify adds a top genres route eventually :(
    my_top_categories: 'categories',
}

const initialPageScroll = {
    home: 0,
    search: 0,
    manage: 0
}
const Dashboard = ({ setLoaded, audioRef }) => {

    const reducer = (state, action) => {
        let route
        let method
        if(action){
            route = action.route
            method = action.method
        }
        switch(route) {
            case routes.user_info:
                return{
                    ...state,
                    user_info: action
                }
            case routes.player_info:
                return{
                    ...state,
                    player_info: action
                }
            case routes.my_liked_tracks: 
                const likedTracks = action.items.map( item => {
                    item.track['added_at'] = item.added_at
                    return item.track
                })
                return{
                    ...state,
                    my_liked_tracks: stopDupesId( state.my_liked_tracks, likedTracks )
                }
            case routes.my_playlists:
                return{
                    ...state,
                    my_playlists: stopDupesId(state.my_playlists, action.items)
                }
                
            case routes.my_albums:
                const cleanedUp = action.items.map( item => {
                    item.album['added_at'] = item.added_at
                    return item.album
                })
                return{
                    ...state,
                    my_albums: stopDupesId(state.my_albums, cleanedUp)
                }
            case routes.recently_played:
                return{
                    ...state,
                    recently_played: state.recently_played = [ ...state.recently_played, ...action.items ]
                }
            case routes.new_releases:
                return{
                    ...state,
                    new_releases: stopDupesId(state.new_releases, action.albums.items)
                }
            case routes.featured_playlists:
                return{
                    ...state,
                    featured_playlists: stopDupesId(state.featured_playlists, action.playlists.items)
                }  
            case routes.recommendations:
                return{
                    ...state,
                    recommendations: stopDupesId(state.recommendations, action.items)
                }
            case routes.available_genre_seeds:
                return{
                    ...state,
                    available_genre_seeds: stopDupesId(state.available_genre_seeds, action.genres)
                }
            case routes.my_top_tracks:
                return{
                    ...state,
                    my_top_tracks: stopDupesId(state.my_top_tracks, action.items)
                }
            case routes.my_top_artists:
                return{
                    ...state,
                    my_top_artists: stopDupesId(state.my_top_artists, action.items)
                }
            case routes.followed_artists:
                return{
                    ...state,
                    followed_artists: stopDupesId(state.followed_artists, action.artists.items )
                }
            case routes.all_categories:
                const items = action.categories.items.map(t => {
                    t['type'] = 'category'
                    return t
                })
                return {
                    ...state,
                    all_categories: stopDupesId( state.all_categories, items )
                }
            case routes.my_top_categories:
                // NOT A REAL ROUTE CALL THEREFORE NO METHOD NEEDED
                return{
                    ...state,
                    my_top_categories: action.items
                }
            default:
                console.log(action)
                return state
                break         
        }
    }
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall()
    const [ state, dispatch ] = useReducer(reducer, initialState)
    const [ scrollPosition, setScrollPosition ] = useState(0)
    const [ overlay, setOverlay ] = useState({})
    const [ selectOverlay, setSelectOverlay ] = useState( [] )
    const [ messageOverlay, setMessageOverlay ] = useState( [] )
    const [ hiddenUI, setHiddenUI ] = useState( false )
    const [ queue, setQueue ] = useState( [] )
    const [ qIndex, setQIndex ] = useState()
    const [ playNextQueue, setPlayNextQueue ] = useState([])
    const [ playerSize, setPlayerSize ] = useState( 'small' )
    const [ dashboardState, setDashboardState ] = useState('home')
    const [ searchState, setSearchState ] = useState('default')
    const [ manageState, setManageState ] = useState( 'default')
    const [ sortContainerOpen, setSortContainerOpen ] = useState( false )
    const [ sortBar, setSortBar ] = useState( false )
    const [ activeSearchItem, setActiveSearchItem ] = useState( {} )
    const [ activeHomeItem, setActiveHomeItem ] = useState( {} ) 
    const [ activeManageItem, setActiveManageItem ] = useState( {} ) 
    const [ toBeManaged, setToBeManaged ] = useState( {} )
    const [ homeTransMinHeight, setHomeTransMinHeight ] = useState( 0 )
    const [ searchTransMinHeight, setSearchTransMinHeight ] = useState( 0 )
    const [ navHeight, setNavHeight ] = useState( undefined )

    const dashboardRef = useRef()
    const pageScrollRef = useRef( initialPageScroll )
    const currActiveHomeRef = useRef( {} )
    const currActiveSearchRef = useRef( {} )
    const searchPageHistoryRef = useRef( [] )
    const homePageHistoryRef = useRef( [] )
    const scrollRef = useRef( scrollPosition )
    const dashboardNavRef = useRef()
    
    const newPlaylistRef = useRef( {} )

    const { user_info, player_info, my_top_genres, my_playlists, featured_playlists, new_releases, my_albums, recently_played, my_top_tracks, my_top_artists, all_categories, available_genre_seeds, followed_artists, my_liked_tracks, my_top_categories } = { ...state }

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
        finalizeRoute('get', routes.user_info, null ,)
    },[])

    useEffect(() => {
        if( user_info.country ){
            firstFetch()
        }
    },[ user_info ])

    useEffect(() => {
        if( all_categories.length > 0 ){
            setLoaded( true )
        }
    }, [ state ])

    const firstFetch = () => {
        const market = user_info.country
        finalizeRoute( 'get', routes.player_info, null, null, null,  `market=${market}`)
        finalizeRoute( 'get', routes.featured_playlists, null, null, null, `market=${market}`)
        finalizeRoute( 'get', routes.new_releases, null, null ,null, 'limit=20' , `market=${market}`)
        finalizeRoute( 'get', routes.my_liked_tracks, null,{ fetchAll: true,  }, null,'limit=50' )
        finalizeRoute( 'get', routes.my_albums, null, { fetchAll: true,  } , null, 'limit=50', `market=${market}` )
        finalizeRoute( 'get', routes.my_playlists, null, { fetchAll: true,  }, null, 'limit=50', `market=${market}` )
        finalizeRoute( 'get', routes.recently_played, null, null, null, 'limit=50') 
        finalizeRoute( 'get', routes.available_genre_seeds, null, null, null, `market=${market}` )
        finalizeRoute( 'get', routes.my_top_tracks, null, { fetchAll: true,  } )
        finalizeRoute( 'get', routes.my_top_artists, null , { fetchAll: true,  })
        finalizeRoute ('get', routes.followed_artists, null, { fetchAll: true,  }, null, 'type=artist')
        finalizeRoute( 'get', routes.all_categories, null,{ fetchAll: true, limit: null }, null, 'limit=50') 
    }

    const refresh = ( cmd ) => {
        const market = user_info.country
        switch( String(cmd) ){
            case 'all':
                finalizeRoute( 'get', routes.player_info, null, null, null,  `market=${market}`)
                finalizeRoute( 'get', routes.my_albums, null, { fetchAll: true  } , null, 'limit=50', `market=${market}` )
                finalizeRoute( 'get', routes.my_playlists, null, { fetchAll: true }, null, 'limit=50', `market=${market}` )
                finalizeRoute( 'get', routes.recently_played, null, { fetchAll: true }, null, 'limit=50' ) 
                finalizeRoute ('get', routes.followed_artists, null, { fetchAll: true }, null, 'type=artist')
                break
            case 'player_info':
                finalizeRoute( 'get', routes.player_info, null, null, null,  `market=${market}`)
                break
            case 'my_albums':
                finalizeRoute( 'get', routes.my_albums, null, { fetchAll: true } , null, 'limit=50', `market=${market}` )
                break
            case 'my_playlists':
                finalizeRoute( 'get', routes.my_playlists, null, { fetchAll: true }, null, 'limit=50', `market=${market}` )
                break    
            case 'followed_artists':
                finalizeRoute ('get', routes.followed_artists, null, { fetchAll: true }, null, 'type=artist')
                break
        }
    }

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[apiPayload])
//  END OF API CALLS 
 
//  When overlays are open, makes the rest of the APP no clicky
    useLayoutEffect(() => {
        const db = dashboardRef.current
        if( overlay.type || playerSize === 'large' || sortContainerOpen ) {
            db.classList.add('noScroll')
        } else{
            db.classList.remove('noScroll')
        }
        if( searchState === 'search' && dashboardState === 'search' ){
            db.classList.add( 'noScroll' )
        } else if (searchState === 'search' && dashboardState !=='search'){
            db.classList.remove( 'noScroll' )
        }
        if( manageState === 'search' && dashboardState === 'manage' ){
            db.classList.add( 'noScroll' )
        } else if (manageState === 'search' && dashboardState !=='manage'){
            db.classList.remove( 'noScroll' )
        }

    }, [ overlay, playerSize, searchState, manageState, dashboardState, sortContainerOpen ])

    useEffect(() => {
        if( activeSearchItem.id || activeHomeItem.id ){
            setSearchState('default')
            setManageState('default')
            setSortContainerOpen( false )
            if( playerSize === 'large' ) setPlayerSize( 'small' )
        }
    },[ activeSearchItem, activeHomeItem ])

    useEffect(() => {
        if(activeManageItem.type){
            setSortContainerOpen( true )
            if(manageState !== 'default' ){
                setManageState('default')
            }
        } else {
            setSortContainerOpen( false )
        }
    }, [ activeManageItem ])

    useEffect(() => {
        if( dashboardState === 'manage' && activeManageItem.type){
            if( !sortContainerOpen ) setSortContainerOpen( true )
        }
    }, [ dashboardState ])

    useEffect(() => {
        if( dashboardNavRef.current === dashboardState ){
            let hideMe = true
            if(scrollPosition <= scrollRef.current || scrollPosition > 98) {
                hideMe = false
            } else {
                hideMe = true
            }
            if (scrollPosition < 1){
                hideMe = false
            }
            if( hideMe ){
                window.scrollTo(0, 100)

            } else {
                window.scrollTo(0, 0)
            }
            setHiddenUI( hideMe )
            scrollRef.current = scrollPosition
        } else {
            dashboardNavRef.current = dashboardState
        }
    }, [ scrollPosition ])

    useEffect(() => {
        const homePage = document.getElementById('homePage')
        const searchPage = document.getElementById('searchPage')
        const managePage = document.getElementById('managePage')
        const pages = [ homePage, searchPage, managePage ]
        if( homePage && searchPage && managePage ) {
            pages.forEach( page => {
                page.style.display = 'none'
            })
            if( dashboardState === 'home' ) {
                homePage.style.display = 'block'
                dashboardRef.current.scroll({ 
                    top: pageScrollRef.current.home - ( window.innerHeight / 2 ) , 
                    left: 0,
                    behavior: 'auto'
                })
            }
            if( dashboardState === 'search' ) {
                searchPage.style.display = 'block'
                dashboardRef.current.scroll({ 
                    top: pageScrollRef.current.search - ( window.innerHeight / 2 ) , 
                    left: 0,
                    behavior: 'auto'
                })
            }
            if( dashboardState === 'manage' ) {
                managePage.style.display = 'block'
                dashboardRef.current.scroll({ 
                    top: pageScrollRef.current.manage - ( window.innerHeight / 2 ), 
                    left: 0,
                    behavior: 'auto'
                })
            }
        }
    },[ dashboardState ])

    useEffect(() => {
        if( selectOverlay.length === 0  && newPlaylistRef.current.id ){
            refresh( 'my_playlists' )
            // Redirects to newly created playlist after SelectOverlay closes
            setTimeout(() => {
                const playlist = { ...newPlaylistRef.current }
                if( playlist.page === 'home'){
                    setActiveHomeItem( playlist )
                } else if( playlist.page === 'search'){
                    setActiveSearchItem( playlist )
                } else if( playlist.page === 'manage'){
                    setActiveManageItem( playlist )
                }
                newPlaylistRef.current = {} 
            },500)
        }
    },[ selectOverlay ])

// DB TRANSITIONS

    const dbScale = useSpring({
        borderRadius: selectOverlay[0] ? '20px' : '0px',
        overflow: selectOverlay[0] ? 'hidden' : 'auto',
        config:{ delay: 500 }
    })

    const messageOverlayTrans = useTransition( messageOverlay.map( item => item ),{
        from: { transform: 'scale(0.00) ', opacity: 1},
        enter: { transform: 'scale(1.00) '},
        leave: { opacity: 0}
    })

    const selectOverlayTrans = useTransition( selectOverlay.length > 0, {
        from: { opacity: 0, pointerEvents: 'none' },
        enter: { opacity: 1, pointerEvents: 'auto' },
        leave: item => async (next, cancel) => {
            await next({ pointerEvents: 'none' })
            await new Promise(resolve => setTimeout( resolve, 500 ))
            await next({ opacity: 0 })
          },

    })

    const overlayTrans = useTransition(overlay.type, {
        initial: { opacity: 0 },
        from: { opacity: 0 },
        enter: { opacity: 1 } ,
        leave: { opacity: 0 }
    })

    // Context set up //////////////////////////////////////////////////

    const dbHookState = {
        audioRef,
        homePageHistoryRef,
        searchPageHistoryRef,
        activeHomeItem, 
        setActiveHomeItem, 
        activeSearchItem, 
        setActiveSearchItem, 
        activeManageItem,
        setActiveManageItem,
        sortContainerOpen, 
        setSortContainerOpen,
        messageOverlay,
        setMessageOverlay,
        selectOverlay,
        setSelectOverlay,
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
        dashboardRef,
        dashboardState,
        setDashboardState,
        toBeManaged, 
        setToBeManaged,
        navHeight,
        setNavHeight,
        playerSize,
        setPlayerSize,
        sortBar,
        setSortBar,
        refresh
    }

    const dbFetchedState = state

    return(
        <DbHookContext.Provider value={ dbHookState }>
        <DbFetchedContext.Provider value={ dbFetchedState }>

            {
            selectOverlayTrans(( props, item) => (
                item &&
                <SelectOverlay style={ props } newPlaylistRef={ newPlaylistRef } />
            ))
            }
            {
            messageOverlayTrans(( props, item, t, i ) => (
                <MessageOverlay style={ props } item={ item }/>
            ))
            }
            {
            overlayTrans( props => (
                <Overlay style={props}  />

            ))
            }

            <animated.section
            style={ dbScale }
            ref={ dashboardRef }
            onScroll={ handleScroll }
            className={ `dashboard ${selectOverlay[0] && 'dashboard--shrink'}`}> 
            
                <Home
                transMinHeight={ homeTransMinHeight }
                setTransMinHeight={ setHomeTransMinHeight }
                currActiveHomeRef={ currActiveHomeRef }
                homePageHistoryRef={ homePageHistoryRef }/> 

                <Search
                transMinHeight={ searchTransMinHeight }
                setTransMinHeight={ setSearchTransMinHeight }
                searchState={ searchState }
                setSearchState={ setSearchState }
                searchPageHistoryRef={ searchPageHistoryRef }
                currActiveSearchRef={ currActiveSearchRef }
                dbDispatch={ dispatch } />

                <Manage 
                toBeManaged={ toBeManaged }
                setToBeManaged={ setToBeManaged }
                manageState={ manageState }
                setManageState={ setManageState } />
                
                <Player 
                hiddenUI={ hiddenUI } 
                playerSize={ playerSize } 
                setPlayerSize={ setPlayerSize }
                navHeight={ navHeight } />

                <Nav 
                homeTransMinHeight={ homeTransMinHeight }
                searchTransMinHeight={ searchTransMinHeight }
                pageScrollRef= { pageScrollRef } />
            </animated.section>
                
        </DbFetchedContext.Provider>
        </DbHookContext.Provider>  
    )
}
export default Dashboard