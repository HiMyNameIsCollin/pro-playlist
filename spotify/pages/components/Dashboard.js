import { useState, useEffect, useReducer, useRef } from 'react'
import { Switch, Route, useLocation, NavLink, Link } from 'react-router-dom'
import { capital } from '../../utils/capital'
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
import Showcase from './Showcase'

const initialState = {
    display_name: '',
    my_top_genres: [],
    my_playlists: [],
    my_albums: [],
    recently_played: [],
    my_top_tracks: [],
    my_top_artists: [],
    all_categories: [],
    featured_playlists: [],
    new_releases: [],
    available_genre_seeds: [],
    active_category: {}
}
const routes = {
        
    display_name: 'v1/me',
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
    // My reducer is based off a set 'Route' string attached during the fetch process,
    // I set the top genre state with a makeshift 'my_top_genres' "route". 
    // Hopefully Spotify adds a top genres route eventually :(
    my_top_genres: 'genres',
    active_category: ''

}

const reducer = (state, action) => {
        switch(action.route) {
            case routes.display_name:
                return{
                    ...state,
                    display_name: action.display_name 
                }
                
            case routes.my_playlists:
                return{
                    ...state,
                    my_playlists: [...state.my_playlists, ...action.items]
                }
                
            case routes.my_albums:
                return{
                    ...state,
                    my_albums: action.items
                }
                
            case routes.recently_played:
                return{
                    ...state,
                    recently_played: action.items
                }
                
            case routes.all_categories:
                return{
                    ...state,
                    all_categories: [ ...state.all_categories, ...action.categories.items ]
                }
                
            case routes.new_releases:
                return{
                    ...state,
                    new_releases: action.albums.items
                }
            
            case routes.featured_playlists:
                return{
                    ...state,
                    featured_playlists: action.playlists.items
                }    

            case routes.recommendations:
                return{
                    ...state,
                    recommendations: action.items
                }
            case routes.available_genre_seeds:
                return{
                    ...state,
                    available_genre_seeds: action.genres
                }
            case routes.my_top_tracks:
                return{
                    ...state,
                    my_top_tracks: action.items
                }
            case routes.my_top_artists:
                return{
                    ...state,
                    my_top_artists: action.items
                }

            case routes.my_top_genres:
                return{
                    ...state,
                    my_top_genres: action.items
                }
            case state.activeCategory.route:

  
        }
          
}

const Dashboard = ({ setAuth }) => {
    const API = 'https://api.spotify.com/'
    const location = useLocation()
    const { setMethod, setRoutes,  apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [scrollPosition, setScrollPosition] = useState()
    const [hiddenUI, setHiddenUI] = useState(false)
    const scrollRef = useRef(scrollPosition)

// CREATES A TOP GENRES ARRAY BECAUSE SPOTIFY WONT GIVE US A ROUTE FOR IT :(
    useEffect(() => {
        if(state.my_top_artists.length > 0) {
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
                    newArr.push({ name: capital( item[0] ) ,  images: item[1]})
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
    const getUser = (...args) => {
        finalizeRoute('get', routes.display_name, ...args)
    }

    const getMyPlaylists = (...args) => {
        finalizeRoute('get', routes.my_playlists, ...args)
    }

    const getMyAlbums = (...args) => {
        finalizeRoute('get', routes.my_albums, ...args)
    }

    const getFeaturedPlaylists = ( ...args ) => {
        finalizeRoute('get', routes.featured_playlists, ...args)
    }

    const getNewReleases = ( ...args ) => {
        finalizeRoute('get', routes.new_releases, ...args)
    }

    const getCategories = ( ...args ) => {
        finalizeRoute('get', routes.all_categories, ...args)
    }

    const getOneCategory = (cat_id, ...args ) => {
        finalizeRoute('get', routes.all_categories + `/${cat_id}`, ...args)
    }

     const getOneCategoryPlaylists = (cat_id, ...args ) => {
        finalizeRoute('get', routes.all_categories + `/${cat_id}` + '/playlists', ...args)
    }

    const getAvailableGenreSeeds = ( ...args ) => {
        finalizeRoute('get', routes.available_genre_seeds, ...args)
    }

    const getRecentlyPlayed = ( ...args ) => {
        finalizeRoute('get', routes.recently_played, ...args)
    }

    const getTopTracks = ( ...args ) => {
        finalizeRoute('get', routes.my_top_tracks, ...args)
    }

    const getTopArtists = ( ...args ) => {
        finalizeRoute('get', routes.my_top_artists, ...args)
    }
    const finalizeRoute = (method, route, ...args) => {
        let finalRoute = route
        if(args.length > 0){
            args.forEach((arg, i) => {
                if( i === 0 ) {
                    finalRoute += `?${arg}`
                }else {
                    finalRoute += `&${arg}`
                }
            })
        }
        setMethod(method)
        setRoutes(finalRoute)
    }

    useEffect(() => {
        getUser()
        setTimeout(() => {
            getFeaturedPlaylists()
        }, 1)
        setTimeout(() => {
            getNewReleases()
        }, 2)
        setTimeout(() => {
            getRecentlyPlayed('limit=6')
        },3)
        setTimeout(() => {
            getCategories('limit=10')
        },4)
        setTimeout(() => {
            getNewReleases()
        },5)
        setTimeout(() => {
            getAvailableGenreSeeds()
        }, 6)
        setTimeout(() => {
            getTopTracks()
        }, 7)
        setTimeout(() => {
            getTopArtists()
        }, 8)
    },[])

    useEffect(() => {
        if(apiPayload){
            dispatch(apiPayload)
        }
    },[apiPayload])
//  END OF API CALLS 

//  NAVIGATION TRANSITIONS
    const transitions = useTransition(location, {
        initial: { transform: 'translatex(100%)' },
        from: { transform: 'translatex(100%)', position: 'absolute', width: '100%'},
        update: { transform: 'translatex(0%)', position: 'relative'},
        enter: { transform: 'translatex(0%)' },
        leave: { transform: 'translatex(-100%)', position: 'absolute'},
    })

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
                            Link={ Link } />
                        </Route> 
                        <Route path='/search'>
                            <Search
                            scrollPosition={ scrollPosition } 
                            state={ state }
                            getCategories={ getCategories }  
                            apiIsPending={ apiIsPending }
                            Link={ Link }/>
                        </Route> 
                        <Route path='/manage'>
                            <Manage />
                        </Route> 
                        <Route path='/artist/:id'>
                            <Artist />
                        </Route> 
                        <Route path='/album/:id'>
                            <Album />
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