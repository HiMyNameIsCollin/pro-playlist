import { useState, useEffect, useReducer, useRef, useLayoutEffect, createContext } from 'react'
import { Switch, Route, useLocation, useHistory, NavLink, Link } from 'react-router-dom'
import { capital } from '../../utils/capital'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { whichPicture } from '../../utils/whichPicture'
import { calcScroll } from '../../utils/calcScroll'
import { useTransition, animated } from 'react-spring'
import  useApiCall  from '../hooks/useApiCall'
import HomeHeader from './HomeHeader'
import SearchHeader from './SearchHeader'
import CollectionHeader from './CollectionHeader'
import ArtistHeader from './ArtistHeader'
import Home from './Home'
import Nav from './Nav'
import Manage from './Manage'
import Search from './Search'
import Artist from './Artist'
import Collection from './Collection'
import Playlist from './Playlist'
import Showcase from './Showcase'
import Overlay from './Overlay'
import Loading from './Loading'

const initialState = {
    user_info: {},
    currently_playing: {},
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
    currently_playing: 'v1/me/player',
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
    followed_artists: 'v1/me/following',
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
            case routes.currently_playing:
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
            case routes.followed_artists:
                return{
                    ...state,
                    followed_artists: action.artists.items
                }

            case routes.my_top_genres:
                // NOT A REAL ROUTE CALL THEREFORE NO METHOD NEEDED
                return{
                    ...state,
                    my_top_genres: action.items
                }

            default:
                console.log(action)
                break
                
        }
}

export const DbHookContext = createContext()

const Dashboard = ({ setAuth }) => {
    // ENV VARIABLE FOR API?
    const API = 'https://api.spotify.com/'
    const location = useLocation()
    const history = useHistory()
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [ state, dispatch ] = useReducer(reducer, initialState)
    const [ scrollPosition, setScrollPosition ] = useState()
    const [ overlay, setOverlay ] = useState(null)
    const [ hiddenUI, setHiddenUI ] = useState(false)
    const [ activeItem, setActiveItem ] = useState(null)
// activeHeader contains the data from the active page required for certain headers to function
    const [ activeHeader , setActiveHeader ] = useState(null)
// headerMounted is used to let the loading element in each page know that its header has mounted and loaded
    const [ headerMounted, setHeaderMounted ] = useState(false)
    const scrollRef = useRef(scrollPosition)
    const locationRef = useRef([{ pathname: location.pathname, activeItem: activeItem, scrollPosition: scrollPosition }])
    const dbHookState = {activeItem, setActiveItem, overlay, setOverlay, activeHeader, setActiveHeader, headerMounted, setHeaderMounted, scrollPosition }

// CREATES A TOP GENRES ARRAY BECAUSE SPOTIFY WONT GIVE US A ROUTE FOR IT :(
    useEffect(() => {
        if(state.my_top_artists.length > 0) {
            const calcTopGenre = (arr) => {
                let genres = {}
                arr.map((ele, i) => {
                    ele.genres.map((genre, j) => {
                        if( state.available_genre_seeds.includes( genre ) ){
                            if(genres[genre]){
                                genres[genre].total += 1
                            }else {
                                genres[genre] = {total: 1, images: ele.images}
                            }
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
            dispatch(payload)
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
        handleScroll()
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
        finalizeRoute( 'get', routes.currently_playing, fetchApi, null)
        finalizeRoute( 'get', routes.featured_playlists, fetchApi, null )
        finalizeRoute( 'get', routes.new_releases, fetchApi, null )
        finalizeRoute( 'get', routes.recently_played, fetchApi, null, 'limit=6' ) 
        finalizeRoute( 'get', routes.all_categories, fetchApi, null, 'limit=10' ) 
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

//  NAVIGATION TRANSITIONS
    const pageTransition = useTransition(location, {
        initial: { transform: 'translateX(100%)' },
        from: { transform: 'translateX(100%)', position: 'absolute', width: '100%'},
        update: {  position: 'relative'},
        enter: { transform: 'translateX(0%)' },
        leave: { transform: 'translateX(-100%)', position: 'absolute'},
    })

    useEffect(() => {
        setActiveHeader( null )
        setHeaderMounted(false)
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
//   Track location and active page for back btn
    useEffect(() => {
        if(locationRef.current[0].pathname !== location.pathname){
            if(locationRef.current.length < 5 ){
                locationRef.current.unshift( {pathname: location.pathname, activeItem: activeItem, scrollPosition : scrollPosition } )
            } else {
                locationRef.current.pop()
                locationRef.current.unshift( {pathname: location.pathname, activeItem: activeItem , scrollPosition : scrollPosition} )
            }
        } 
    },[])

// Reset activeItem to null, otherwise you cant access same page twice in a row.
    useEffect(() => {
        if(location.pathname === '/' || location.pathname === 'search' || location.pathname === '/manage'){
            setActiveItem( null )
            
        }
    }, [ location.pathname ] )

    useLayoutEffect(() => {
        const body = document.querySelector('body')
        if( overlay ) {
            body.classList.add('noScroll')
        } else{
            body.classList.remove('noScroll')
        }
    }, [overlay])

    return(
        <DbHookContext.Provider value={ dbHookState }>
        <section className='dashboard'>  

        
{/* Headers are kept seperate from their respective pages because these are fixed positiong, 
and if I put them inside the page, they will be fixed to the container and not the page. */}

            <Switch >
                <Route exact path='/'>
                    <HomeHeader 
                    setAuth={ setAuth } 
                    hiddenUI={ hiddenUI } /> 
                </Route> 
                <Route path='/search'>
                    <SearchHeader hiddenUI={ hiddenUI }/>
                </Route> 
                <Route path='/artist/:id'>
                    {
                        activeHeader &&
                        <ArtistHeader 
                        data={ activeHeader } />
                    }
                </Route> 
                <Route path='/album/:id' >
                    {
                        activeHeader &&
                        <CollectionHeader 
                        data={ activeHeader } />
                    }
                </Route>
                <Route path='/playlist/:id' >
                    {
                        activeHeader &&
                        <CollectionHeader 
                        data={ activeHeader } />
                    }
                </Route>
            </Switch>

            <Overlay />
                
            {
            pageTransition((props, item) => (
                <animated.div style={ props }>
                    <Switch location={ item }>
                        <Route exact path='/'>
                            <Home
                            state={ state }/>
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
                            <Artist 
                            genreSeeds={ state.available_genre_seeds}
                            location={ location }/>
                        </Route> 
                        <Route path='/album/:id'>
                            <Collection
                            type='album'
                            genreSeeds={ state.available_genre_seeds}
                            location={ location } />
                        </Route>
                        <Route path='/playlist/:id'>
                            <Collection
                            type='playlist'
                            genreSeeds={ state.available_genre_seeds}
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
            {
                !overlay &&
                <Nav location={ location } hiddenUI={ hiddenUI } NavLink={ NavLink } /> 
            }
        </section>  
        </DbHookContext.Provider>  
    )
}
export default Dashboard