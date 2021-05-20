import { useState, useEffect, useReducer, useRef, createContext } from 'react'
import { Switch, Route, useLocation, useHistory, NavLink, Link } from 'react-router-dom'
import { capital } from '../../utils/capital'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { whichPicture } from '../../utils/whichPicture'
import  useApiCall  from '../../hooks/useApiCall'
import { useTransition, animated } from 'react-spring'

import HomeHeader from './HomeHeader'
import SearchHeader from './SearchHeader'
import Home from './Home'
import Nav from './Nav'
import Manage from './Manage'
import Search from './Search'
import Artist from './Artist'
import Album from './Album'
import Playlist from './Playlist'
import Showcase from './Showcase'
import Loading from './Loading'

const initialState = {
    user_info: {},
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
    search: 'v1/search',
    available_genre_seeds: 'v1/recommendations/available-genre-seeds',
    get_album: 'v1/albums',
    get_artist: 'v1/artists',
    // My reducer is based off a set 'Route' string attached during the fetch process,
    // I set the top genre state with a makeshift 'my_top_genres' "route". 
    // Hopefully Spotify adds a top genres route eventually :(
    my_top_genres: 'genres',
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
                
            case routes.all_categories:
                if(method === 'get'){
                    return{
                        ...state,
                        all_categories: [ ...state.all_categories, ...action.categories.items ]
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

            case routes.my_top_genres:
                // NOT A REAL ROUTE CALL THEREFORE NO METHOD NEEDED
                return{
                    ...state,
                    my_top_genres: action.items
                }

            default:
                break
                
        }
}

const Dashboard = ({ setAuth }) => {
    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const location = useLocation()
    const history = useHistory()
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [scrollPosition, setScrollPosition] = useState()
    const [hiddenUI, setHiddenUI] = useState(false)
    const [activeItem, setActiveItem] = useState(null)
    const scrollRef = useRef(scrollPosition)
    const locationRef = useRef([location.pathname])
// CREATES A TOP GENRES ARRAY BECAUSE SPOTIFY WONT GIVE US A ROUTE FOR IT :(
    useEffect(() => {
        if(state.my_top_artists.length > 0) {
            console.log('Leakin')
            let mounted = true
            const calcTopGenre = (arr) => {
                let genres = {}
                arr.map((ele, i) => {
                    ele.genres.map((genre, j) => {
                        if(genres[genre]){
                            genres[genre].total += 1
                        }else {
                            genres[genre] = {total: 1, images: ele.images}
                        }
                    })
                })
                let sortable = []
                for(const genre in genres){
                    sortable.push([genre, genres[genre].images, genres[genre].total])
                }
                sortable.sort((a,b) => {
                    return b[2] - a[2]
                })
                let newArr = []
                sortable.map((item, i) => {
                    newArr.push({ name: capital( item[0] ), id: item[0] , type: 'genre' ,  images: item[1]})
                })
                return newArr
            }
            let topArtists = [...state.my_top_artists]
            const topGenres = calcTopGenre(topArtists)
            const payload = {
                route: 'genres',
                items: topGenres
            }
            if(mounted) dispatch(payload)
            return () => mounted = false
        }
    },[state.my_top_artists])

// HANDLE SCROLL PERCENTAGE AND DISPLAY OF UI 

    useEffect(() => {
        if(scrollPosition < scrollRef.current || scrollPosition < 1 || scrollPosition === 100 ){
            if( hiddenUI ){
                setHiddenUI(false)   
            }                     
        } else {
            setHiddenUI(true)
        }
        scrollRef.current = scrollPosition
    }, [ scrollPosition ])

    useEffect(() => {
        handleDashboard()
        window.addEventListener('scroll', handleDashboard)
    },[])

    const calcScrollPercent = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = (winScroll / height) * 100
        return percent
    }
 
    const handleDashboard = () => {
        const percent = calcScrollPercent()
        setScrollPosition( percent ? percent : 0)
    }

// API CALLS 
    useEffect(() => {
        finalizeRoute('get', routes.user_info, fetchApi)
        setTimeout(() => finalizeRoute( 'get', routes.featured_playlists, fetchApi ), 1)
        setTimeout(() => finalizeRoute( 'get', routes.new_releases, fetchApi ), 2)
        setTimeout(() => finalizeRoute( 'get', routes.recently_played, fetchApi, 'limit=6' ) , 3)
        setTimeout(() => finalizeRoute( 'get', routes.all_categories, fetchApi, 'limit=10' ) , 4)
        setTimeout(() => finalizeRoute( 'get', routes.new_releases, fetchApi ), 5)
        setTimeout(() => finalizeRoute( 'get', routes.available_genre_seeds, fetchApi ), 6)
        setTimeout(() => finalizeRoute( 'get', routes.my_top_tracks, fetchApi ), 7)
        setTimeout(() => finalizeRoute( 'get', routes.my_top_artists, fetchApi ), 8)
    },[])
    useEffect(() => {
        if(apiPayload) dispatch(apiPayload)
    },[apiPayload])
//  END OF API CALLS 

//  NAVIGATION TRANSITIONS
    const transitions = useTransition(location, {
        initial: { transform: 'translatex(100%)' },
        from: { transform: 'translatex(100%)', position: 'absolute', width: '100%'},
        update: {  position: 'relative'},
        enter: { transform: 'translatex(0%)' },
        leave: { transform: 'translatex(-100%)', position: 'absolute'},
    })

    useEffect(() => {
        if(activeItem && activeItem.type){
            switch(activeItem.type){
                case 'artist':
                    if(location.pathname !== `/artist/${activeItem.id}`){
                        history.push(`/artist/${activeItem.id}`)
                    }
                    break
                case 'album':
                    if(location.pathname !== `/album/${activeItem.id}`){
                        history.push(`/album/${activeItem.id}`)
                    }
                    
                    break
                case 'playlist':
                    if(location.pathname !== `/playlist/${activeItem.id}`){
                        history.push(`/playlist/${activeItem.id}`)
                    }
                    
                    break
                case 'genre':
                    if(location.pathname !== `/search/${activeItem.id}`){
                        history.push(`/search/${activeItem.id}`)
                    }
                    break
                default:
                    if(location.pathname !== `/showcase/${activeItem.id}`){
                        history.push(`/showcase/${activeItem.id}`)
                    }
                    
                    break
            }
        }

    },[ activeItem ])
//  Track location and active page for back btn
    useEffect(() => {
        if(locationRef.current[0].pathname !== location.pathname){
            if(locationRef.current.length < 5 ){
                locationRef.current.unshift( {pathname: location.pathname, activeItem: activeItem} )
            } else {
                locationRef.current.pop()
                locationRef.current.unshift( {pathname: location.pathname, activeItem: activeItem} )
            }
        }
    },[ location.pathname ])

    useEffect(() => {
        if(location.pathname === '/' || location.pathname === 'search' || location.pathname === '/manage'){
            setActiveItem( null )
        }
    }, [ location.pathname ] )

    return(
        <section className="wrapper">
            <div className='dashboard'>
            
            <Switch >
                <Route exact path='/'>
                    <HomeHeader 
                    setAuth={ setAuth } 
                    hiddenUI={ hiddenUI } /> 
                </Route> 
                <Route path='/search'>
                    <SearchHeader hiddenUI={ hiddenUI }/>
                </Route> 
                <Route path='/manage'>
                    <SearchHeader hiddenUI={ hiddenUI }/>
                </Route> 
            </Switch>
            
            {
            transitions((props, item) => (
                <animated.div style={ props }>
                    <Switch location={ item }>
                        <Route exact path='/'>
                            <Home
                            state={ state }
                            setActiveItem={ setActiveItem } />
                        </Route> 
                        <Route path='/search'>
                            <Search
                            scrollPosition={ scrollPosition } 
                            state={ state } 
                            apiIsPending={ apiIsPending }/>
                        </Route> 
                        <Route path='/manage'>
                            <Manage />
                        </Route> 
                        <Route path='/artist/:id'>
                            <Artist  />
                        </Route> 
                        <Route path='/album/:id'>
                            <Album
                            item={ activeItem }
                            setActiveItem={ setActiveItem }
                            location={ location } />
                        </Route>
                        <Route path='/playlist/:id'>
                            <Playlist
                            location={ location } />
                        </Route> 
                        <Route path='/showcase/:id'>
                            <Showcase 
                            location={ location } />
                        </Route> 
                    </Switch>
                </animated.div>
            ))
            }
            </div>
            <Nav location={ location } hiddenUI={ hiddenUI } NavLink={ NavLink } /> 
        </section>
    )
}
export default Dashboard