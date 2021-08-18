import { useState, useEffect, useReducer, useRef, useLayoutEffect, createContext } from 'react'
import { useSpring, animated, useTransition } from 'react-spring'
import { calcScroll } from '../../utils/calcScroll'
import  useApiCall  from '../hooks/useApiCall'
import Home from './Home'
import Manage from './manage/Manage'
import Search from './search/Search'

import Overlay from './Overlay'
import MessageOverlay from './MessageOverlay'
import SelectOverlay from './SelectOverlay'
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
    followed_artists: []
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
}



const initialPageScroll = {
    home: 0,
    search: 0,
    manage: 0
}
const Dashboard = ({ setAuth, audioRef }) => {


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
                if(method==='get'){
                    return{
                        ...state,
                        player_info: action
                    }
                }
            case routes.my_liked_tracks: 
                if(method === 'get'){
                    const cleanedUp = action.items.map( item => {
                        item.track['added_at'] = item.added_at
                        return item.track
                    })
                    return{
                        ...state,
                        my_liked_tracks: [ ...state.my_liked_tracks, ...cleanedUp ]
                    }
                }
            case routes.my_playlists:
                if(method === 'get'){
                    return{
                        ...state,
                        my_playlists: [ ...state.my_playlists, ...action.items ]
                    }
                } else if( method === 'put'){
                    
                }
            case routes.my_albums:
                if(method === 'get'){
                    const cleanedUp = action.items.map( item => {
                        item.album['added_at'] = item.added_at
                        return item.album
                    })
                    return{
                        ...state,
                        my_albums: [...state.my_albums, ...cleanedUp]
                    }
                }
            case routes.recently_played:
                if(method === 'get'){
                    return{
                        ...state,
                        recently_played: [...state.recently_played, ...action.items]
                    }
                }             
            case routes.new_releases:
                if(method === 'get'){
                    return{
                        ...state,
                        new_releases: [...state.new_releases, ...action.albums.items]
                    }
                }
            case routes.featured_playlists:
                if(method === 'get'){
                    return{
                        ...state,
                        featured_playlists: [ ...state.featured_playlists, ...action.playlists.items]
                    }  
                }  
            case routes.recommendations:
                if(method === 'get'){
                    return{
                        ...state,
                        recommendations: [...state.recommendations, ...action.items]
                    }
                }
            case routes.available_genre_seeds:
                if(method === 'get'){
                    return{
                        ...state,
                        available_genre_seeds: [...state.available_genre_seeds, ...action.genres ]
                    }
                }
            case routes.my_top_tracks:
                if(method === 'get'){
                    return{
                        ...state,
                        my_top_tracks: [...state.my_top_tracks, ...action.items]
                    }
                }
            case routes.my_top_artists:
                if(method === 'get'){
                    return{
                        ...state,
                        my_top_artists: [...state.my_top_artists, ...action.items]
                    }
                } 
            case routes.followed_artists:
                if(method === 'get'){
                    return{
                        ...state,
                        followed_artists: [ ...state.followed_artists, ...action.artists.items ]
                    }
        
                }
                
            default:
                console.log(action)
                break         
        }
    }
    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const [ state, dispatch ] = useReducer(reducer, initialState)
    const [ loaded, setLoaded ] = useState( false )
    const [ scrollPosition, setScrollPosition ] = useState(0)
    const [ overlay, setOverlay ] = useState({})
    const [ selectOverlay, setSelectOverlay ] = useState( [] )
    const [ messageOverlay, setMessageOverlay ] = useState( { message: '', active: false } )
    const [ hiddenUI, setHiddenUI ] = useState( false )
// activeHeader contains the data from the active page required for certain headers to function
    const [ queue, setQueue ] = useState( [] )
    const [ qIndex, setQIndex ] = useState()
    const [ playNextQueue, setPlayNextQueue ] = useState([])
    const [ playerSize, setPlayerSize ] = useState( 'small' )
    const [ dashboardState, setDashboardState ] = useState('home')
    const [ searchState, setSearchState ] = useState('default')
    const [ manageState, setManageState ] = useState( 'default')
    const [ sortContainerOpen, setSortContainerOpen ] = useState( false )
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
    
    const newPlaylistRef = useRef( {} )

    const { user_info, player_info, my_top_genres, my_playlists, featured_playlists, new_releases, my_albums, recently_played, my_top_tracks, my_top_artists, all_categories, available_genre_seeds, followed_artists, my_liked_tracks } = { ...state }

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
        loaded, 
        setLoaded,
        setAuth,
        dashboardRef,
        dashboardState,
        toBeManaged, 
        setToBeManaged,
        navHeight,
        setNavHeight,
        playerSize,
        setPlayerSize
    }

    const dbFetchedState = {
        user_info,
        player_info,
        my_liked_tracks,
        my_top_genres,
        my_playlists, 
        featured_playlists, 
        new_releases, 
        my_albums, 
        recently_played, 
        my_top_tracks, 
        my_top_artists, 
        all_categories, 
        available_genre_seeds, 
        followed_artists
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
        finalizeRoute('get', routes.user_info, null ,)
    },[])


    useEffect(() => {
        if(user_info.country){
            const market = user_info.country
            finalizeRoute( 'get', routes.player_info, null, null, null,  `market=${market}`)
            finalizeRoute( 'get', routes.featured_playlists, null, null, null, `market=${market}`)
            finalizeRoute( 'get', routes.new_releases, null, null ,null, 'limit=20' , `market=${market}`)
            finalizeRoute( 'get', routes.my_liked_tracks, null,{ fetchAll: true, limit: null }, null,'limit=50', `market=${market}` )
            finalizeRoute( 'get', routes.my_albums, null, { fetchAll: true, limit: null } , null, 'limit=50', `market=${market}` )
            finalizeRoute( 'get', routes.my_playlists, null, { fetchAll: true, limit: null }, null, 'limit=50', `market=${market}` )
            finalizeRoute( 'get', routes.recently_played, null, { fetchAll: true, limit: 4 }, null, 'limit=50' , `market=${market}`) 
            finalizeRoute( 'get', routes.available_genre_seeds, null, null, null, `market=${market}` )
            finalizeRoute( 'get', routes.my_top_tracks, null, { fetchAll: true, limit: null } )
            finalizeRoute( 'get', routes.my_top_artists, null , { fetchAll: true, limit: null })
            finalizeRoute ('get', routes.followed_artists, null, { fetchAll: true, limit: null }, null, 'type=artist')
        }
    },[ user_info ])

    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[apiPayload])
//  END OF API CALLS 
 


//  When overlay is open, makes the rest of the APP no clicky
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
        } else {
            setSortContainerOpen( false )
        }
    }, [ activeManageItem ])

    useEffect(() => {
        let hideMe = true
        if( activeManageItem.type ){
            if( dashboardState !== 'manage'){
                if(scrollPosition <= scrollRef.current && scrollPosition < 98) {
                    hideMe = false
                } else {
                    hideMe = true
                }
                if (scrollPosition < 1){
                    hideMe = false
                }
            }else { 
                hideMe = true
            }
        }else {
            if(scrollPosition <= scrollRef.current && scrollPosition < 98 ) {
                hideMe = false
            } else {
                hideMe = true
            }
            if (scrollPosition < 1){
                hideMe = false
            }
        }

        setHiddenUI( hideMe )
        scrollRef.current = scrollPosition
    }, [ scrollPosition, activeManageItem, dashboardState ])

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
                    top: pageScrollRef.current.home - 160, 
                    left: 0,
                    behavior: 'auto'
                })
            }
            if( dashboardState === 'search' ) {
                searchPage.style.display = 'block'
                dashboardRef.current.scroll({ 
                    top: pageScrollRef.current.search - 160, 
                    left: 0,
                    behavior: 'auto'
                })
            }
            if( dashboardState === 'manage' ) {
                managePage.style.display = 'block'
                dashboardRef.current.scroll({ 
                    top: pageScrollRef.current.manage - 160, 
                    left: 0,
                    behavior: 'auto'
                })
            }
            
        }
        // if( dashboardState === 'home' ) {
        //     homePage.style.display = 'block'
        //     dashboardRef.current.scroll({ 
        //         top: pageScrollRef.current.home - 160, 
        //         left: 0,
        //         behavior: 'auto'
        //     })
        // }
        // DASHBOARD STATE NEEDS TO BE SET AS DEPENDENCY ONCE IM DONE MANAGE PAGE
            
    },[ dashboardState ])

    useEffect(() => {
        if( selectOverlay.length > 0 && newPlaylistRef.current.id ){
            setTimeout(() => {
                const playlist = { ...newPlaylistRef.current }
                setActiveHomeItem( playlist )
                newPlaylistRef.current = {} 
            },1000)
        }
    },[ selectOverlay ])


    const dbScale = useSpring({
        borderRadius: selectOverlay[0] ? '20px' : '0px',
        overflow: selectOverlay[0] ? 'hidden' : 'auto',
        config:{ delay: 500 }
    })

    const selectOverlayTrans = useTransition( selectOverlay.map( item => item), {
        from: { transform: 'translateY(100%)' },
        enter: item => async (next, cancel) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            await next({ transform: 'translateY(0%)' })
          },
        leave: { transform: 'translateY(100%)'}
    })

    return(
        <DbHookContext.Provider value={ dbHookState }>
        <DbFetchedContext.Provider value={ dbFetchedState }>

            {
            selectOverlayTrans(( props, item, t, i ) => (
                <SelectOverlay dbDispatch={ dispatch } style={ props } menuData={item} position={ i } newPlaylistRef={ newPlaylistRef }/>
            ))
            }
            

            <Overlay setActiveSearchItem={ setActiveSearchItem } />
            <MessageOverlay messageOverlay={ messageOverlay } setMessageOverlay={ setMessageOverlay } response={ apiPayload } />

            <animated.section
            style={ dbScale }
            ref={ dashboardRef }
            onScroll={ handleScroll }
            className={ `dashboard ${selectOverlay[0] && 'dashboard--shrink'}`}> 
            {
                
            }
                <Home
                transMinHeight={ homeTransMinHeight }
                setTransMinHeight={ setHomeTransMinHeight }
                currActiveHomeRef={ currActiveHomeRef }
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

                <Manage 
                activeManageItem={ activeManageItem } 
                setActiveManageItem={ setActiveManageItem }
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
                dashboardRef={ dashboardRef }
                homeTransMinHeight={ homeTransMinHeight }
                searchTransMinHeight={ searchTransMinHeight }
                dashboardRef={ dashboardRef }
                pageScrollRef= { pageScrollRef }
                hiddenUI={ hiddenUI } 
                scrollPosition={ scrollPosition }
                activeHomeItem={ activeHomeItem }
                activeSearchItem={ activeSearchItem }
                activeManageItem={ activeManageItem }
                setActiveHomeItem={ setActiveHomeItem }
                setActiveSearchItem={ setActiveSearchItem }
                dashboardState={ dashboardState }
                setDashboardState={ setDashboardState }
                setNavHeight={ setNavHeight } />
            </animated.section>
                
        </DbFetchedContext.Provider>
        </DbHookContext.Provider>  
    )
}
export default Dashboard