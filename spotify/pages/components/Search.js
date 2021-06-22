import { useState, useEffect, useReducer, useRef, useLayoutEffect, useContext, createContext } from 'react'
import { capital } from '../../utils/capital'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { useTransition, animated } from 'react-spring'
import  useApiCall  from '../hooks/useApiCall'

import FixedHeader from './FixedHeader'
import Artist from './Artist'
import Collection from './Collection'
import Showcase from './Showcase'

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

const Search = ({ my_top_artists, available_genre_seeds  }) => {
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)

    const [ state, dispatch ] = useReducer( reducer , initialState )
    const [ searchState, setSearchState ] = useState('default')
    const [ currentPage, setCurrentPage ] = useState('default')

    const { activeSearchItem, setActiveSearchItem } = useContext( DbHookContext )

    const searchHookState ={
        searchState, 
        setSearchState,
        currentPage,
        setCurrentPage
    }

    useEffect(() => {
        finalizeRoute( 'get', routes.all_categories, fetchApi, null, 'limit=10' ) 
        
    },[])

    useEffect(() => {
        if( apiPayload ) dispatch(apiPayload)
    }, [ apiPayload ])

    useEffect(() => {
        if( activeSearchItem ){
            console.log(activeSearchItem)
        }
    },[ activeSearchItem ])

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
        if( activeSearchItem.type ){
            switch( activeSearchItem.type ){
                case 'genre':
                    setCurrentPage('showCase')
                    break
                case 'category':
                    setCurrentPage('showcase')
                    break
                default:
                    console.log(activeItem)
                    break
            }
        } 
    },[ activeSearchItem ])

    const pageTransition = useTransition(currentPage, {
        initial: { transform: 'translateX(100%)', },
        from: { transform: 'translateX(100%)', position: 'absolute', width: '100%'},
        update: {  position: 'relative'},
        enter: { transform: 'translateX(0%)' },
        leave: { transform: 'translateX(-20%)', position: 'absolute'},
    })

    return(
        <SearchHookContext.Provider value={ searchHookState }>
        
        {
            pageTransition((props, item) => (
                <animated.div style={ props }>
                    {
                    item === 'default' ?
                    <div className='page page--search'>
                        <BrowseContainer 
                        type='genres'
                        message='My top genres' 
                        data={ state.my_top_genres.slice(0, 4) }/>
                        <BrowseContainer
                        message='Browse all' 
                        data={ state.all_categories }/> 
                    </div> 
                    :
                    <Showcase data={ activeSearchItem } />
                    }
                        
                </animated.div>
            ))
        }
        
        </SearchHookContext.Provider>
    )
}

export default Search