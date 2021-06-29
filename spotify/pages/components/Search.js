import { useState, useEffect, useReducer, useRef, useContext, createContext } from 'react'
import { capital } from '../../utils/capital'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { useTransition, animated } from 'react-spring'
import  useApiCall  from '../hooks/useApiCall'

import SearchHeader from './SearchHeader'
import FixedHeader from './FixedHeader'
import Artist from './Artist'
import Collection from './Collection'
import Showcase from './Showcase'
import Loading from './Loading'

import BrowseContainer from './BrowseContainer'
import { DbHookContext } from './Dashboard'


const initialState = {
    all_categories: [],
    search: {},
    my_top_genres: [],
}

const routes = {
    all_categories: 'v1/browse/categories',
    search: 'v1/search',
    // My reducer is based off a set 'Route' string attached during the fetch process,
    // I set the top genre state with a makeshift 'my_top_genres' "route". 
    // Hopefully Spotify adds a top genres route eventually :(
    my_top_genres: 'genres',
}

const reducer = ( state, action ) => {
    let route
    let method
    if(action){
        route = action.route
        method = action.method
    }
    switch(route) {
        case routes.all_categories:
            if(method === 'get'){
                action.categories.items.map(t => t['type'] = 'category')
                return{
                    ...state,
                    all_categories: [ ...state.all_categories, ...action.categories.items ]
                }
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

export const SearchHookContext = createContext()

const Search = ({  my_top_artists, available_genre_seeds, searchPageHistoryRef: pageHistoryRef, currentSearchPage, setCurrentSearchPage }) => {
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)

    const [ state, dispatch ] = useReducer( reducer , initialState )
    const [ activeSearchItem, setActiveSearchItem ] = useState( pageHistoryRef.current.length > 0 ? pageHistoryRef.current[ pageHistoryRef.current.length - 1].activeSearchItem : {} )
    const [ activeHeader, setActiveHeader ] = useState( {} )
    const [ headerScrolled, setHeaderScrolled ] = useState( 0 )
    const [ searchState, setSearchState ] = useState('default')
    const [ loaded, setLoaded ] = useState( false )
    
    const { overlay, scrollPosition } = useContext( DbHookContext )

    const searchHookState ={
        searchState, 
        setSearchState,
        currentSearchPage,
        setCurrentSearchPage,
        activeSearchItem,
        setActiveSearchItem,

    }

    useEffect(() => {
        finalizeRoute( 'get', routes.all_categories, fetchApi, null, 'limit=10' ) 
    },[])

    useEffect(() => {
        if(currentSearchPage === 'default' || currentSearchPage === 'showcase') {
            // setHiddenUI( false )
        }
    },[ currentSearchPage ])
    

    useEffect(() => {
        if( apiPayload ) dispatch(apiPayload)
    }, [ apiPayload ])


    // CREATES A TOP GENRES ARRAY BECAUSE SPOTIFY WONT GIVE US A ROUTE FOR IT :(
    useEffect(() => {
        if(my_top_artists.length > 0 && state.my_top_genres.length === 0) {
            let topArtists = [...my_top_artists]
            const topGenres = calcTopGenre(topArtists)
            const payload = {
                route: 'genres',
                items: topGenres
            }
            dispatch(payload)
        }
    },[my_top_artists])

    const calcTopGenre = (arr) => {
        let genres = {}
        arr.map((ele, i) => {
            ele.genres.map((genre, j) => {
                if( available_genre_seeds.includes( genre ) ){
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

    useEffect(() => {
        // setActiveHeader( null )
        // setHiddenUI(true)
        if( activeSearchItem ){
            
            switch( activeSearchItem.type ){
                case 'genre':
                    setCurrentSearchPage( 'showcase' )
                    break
                case 'category':
                    setCurrentSearchPage( 'showcase' )
                    break
                case 'playlist':
                    setCurrentSearchPage( 'playlist' )
                    break
                case 'album':
                    setCurrentSearchPage( 'album' )
                    break
                case 'artist':
                    setCurrentSearchPage( 'artist' )
                    break
                default:
                    setCurrentSearchPage( 'default')
                    break
            }
        } 
    },[ activeSearchItem ])

    useEffect(() => {
        if(currentSearchPage === 'default'){
            pageHistoryRef.current = []
        } else {
            pageHistoryRef.current.push({ currentSearchPage, activeSearchItem})

        }
    }, [ currentSearchPage ])

    const pageTransition = useTransition(currentSearchPage, {
        initial: { transform: 'translateX(100%)', },
        from: { transform: 'translateX(100%)', position: 'absolute', width: '100%' , zIndex: 2 },
        update: {  position: 'relative'},
        enter: { transform: 'translateX(0%)', zIndex: 2},
        leave: { transform: 'translateX(-20%)', position: 'absolute', zIndex: 1},
    })

    const headerTransition = useTransition(currentSearchPage, {
        from: { transform: 'translateX(100%)', position: 'fixed', width: '100%' , zIndex: 3 },
        update: {  position: 'fixed'},
        enter: { transform: 'translateX(0%)' },
        leave: { transform: 'translateX(-20%)', position: 'fixed', zIndex: 1},
    })

    const headerTransition2 = useTransition(currentSearchPage, {
        from: { transform: 'translateX(0%)', position: 'fixed', width: '100%', zIndex: 3},
        update: { position: 'fixed' },
        enter: { transform: 'translateX(0%)' },
        leave: { transform: 'translateX(-100%)',  position: 'fixed', zIndex: 1},
    })
    

    const mainTransition = useTransition(currentSearchPage, {
        from: { transform: 'translateX(0%)', position: 'absolute', width: '100%' , zIndex: 2},
        update: {  position: 'relative'},
        enter: { transform: 'translateX(0%)' },
        leave: { transform: 'translateX(-20%)', position: 'absolute', zIndex: 1},
    })

    return(
        <SearchHookContext.Provider value={ searchHookState }>   
        <div id='searchPage' >
        {
            headerTransition2(( props, item ) => (
                <animated.div style={ props }>
                    {
                        item === 'default' &&
                        <SearchHeader /> 
                    }
                    {
                        item === 'showcase' &&
                        <SearchHeader /> 
                    }
                </animated.div>
            ))
        } 
        {
        headerTransition(( props, item )=> (
            <animated.div style={ props }>
            {
            item === 'artist' ||
            item === 'playlist' ||
            item === 'album' ?
            <FixedHeader type={'Search'} activeHeader={ activeHeader } headerScrolled={ headerScrolled }/>:
            null
            }
            </animated.div>
        ))
        }
        {
        mainTransition((props, item) => (
            
                item === 'default' &&
                <animated.div 
                style={props}
                className={ `page page--search ${ overlay.type && 'page--blurred' }` }>
                    <BrowseContainer 
                    type='BcSearch'
                    message='My top genres' 
                    data={ state.my_top_genres.slice(0, 4) }/>
                    <BrowseContainer
                    message='Browse all' 
                    type='BcSearch'
                    data={ state.all_categories }/> 
                </animated.div> 
        
        ))
        }
        {
        pageTransition((props, item) => (
            <animated.div style={ props }>
                {
                item === 'showcase' &&
                    <Showcase data={ activeSearchItem } /> 
                }
                {
                item === 'playlist' &&
                    <Collection 
                    activeHeader={ activeHeader }
                    setActiveHeader={ setActiveHeader }
                    headerScrolled={ headerScrolled }
                    setHeaderScrolled={ setHeaderScrolled}
                    type='playlist'
                    genreSeeds={ available_genre_seeds }/>
                }
                {
                item === 'album' &&
                    <Collection 
                    activeHeader={ activeHeader }
                    setActiveHeader={ setActiveHeader }
                    headerScrolled={ headerScrolled }
                    setHeaderScrolled={ setHeaderScrolled}
                    type='album'
                    genreSeeds={ available_genre_seeds }/> 
                }
                {
                item === 'artist' &&
                    <Artist 
                    type='artist'
                    activeHeader={ activeHeader }
                    setActiveHeader={ setActiveHeader }
                    headerScrolled={ headerScrolled }
                    setHeaderScrolled={ setHeaderScrolled}
                    genreSeeds={ available_genre_seeds}/> 
                }
                    
            </animated.div>
        ))
        }
        </div>    

        
        </SearchHookContext.Provider>
    )
}

export default Search