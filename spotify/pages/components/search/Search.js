import { useState, useEffect, useContext, createContext } from 'react'
import { capital } from '../../../utils/capital'
import { useTransition, animated } from 'react-spring'
import SearchHeader from './SearchHeader'
import FixedHeader from '../FixedHeader'
import Artist from '../artist/Artist'
import Collection from '../collection/Collection'
import SearchHome from './SearchHome'
import Showcase from '../Showcase'
import SearchOverlay from './SearchOverlay'

import { DbHookContext, DbFetchedContext } from '../Dashboard'

export const SearchPageSettingsContext = createContext()
export const SearchHookContext = createContext()

const Search = ({  
    transMinHeight,
    setTransMinHeight,
    searchPageHistoryRef, 
    currActiveSearchRef,
    searchState,
    setSearchState, 
    dbDispatch }) => {

    const [ activeHeader, setActiveHeader ] = useState( {} )
    const [ headerScrolled, setHeaderScrolled ] = useState( 0 )
    const [ transitionComplete, setTransitionComplete ] = useState( false )
    
    const { scrollPosition, selectOverlay, dashboardRef, activeSearchItem, setActiveSearchItem, } = useContext( DbHookContext )
    const { all_categories, my_top_artists, available_genre_seeds,  } = useContext( DbFetchedContext )

    const searchHookState ={
        searchState, 
        setSearchState,
        activeSearchItem,
        setActiveSearchItem,
    }

    const searchPageSettingsState = {
        headerScrolled,
        setHeaderScrolled,
        transitionComplete,
        setTransitionComplete,
        activeHeader, 
        setActiveHeader,
        transMinHeight,
        setTransMinHeight
    }

    useEffect(() => {
        if( transitionComplete && (!activeSearchItem.type || activeSearchItem.type === 'category' )){
            setTransitionComplete( false )
        }
    },[ transitionComplete ])

    // CREATES A TOP GENRES ARRAY BECAUSE SPOTIFY WONT GIVE US A ROUTE FOR IT :(
    useEffect(() => {
        if(my_top_artists.length > 0 && all_categories.length > 0) {
            let topArtists = [...my_top_artists]
            const categories = calcCategories(topArtists)
            const sortedCats = sortCategories( categories )
            const payload = {
                route: 'categories',
                items: sortedCats
            }
            dbDispatch(payload)
        }
    },[my_top_artists, all_categories])

    const calcCategories = ( artists ) => {
       let categories = {}
       artists.forEach((art, i ) => {
           art.genres.forEach(( genre, j ) => {
                all_categories.forEach((cat, k) => {
                    if( available_genre_seeds.includes( genre.toLowerCase().replace(' ', '-') ) ){
                        const foundCat = cat.name.toLowerCase().search( genre )
                        if( foundCat !== -1 ){
                            if( cat.name.charAt( foundCat - 1 ) === '-' ||
                                cat.name.charAt( foundCat - 1 ) === ' ' ||
                                cat.name.charAt( foundCat + genre.length ) === ' ' ) return
                            if(categories[cat.name]){
                                categories[cat.name].total += 1
                                }else {
                                    categories[cat.name] = {total: 1, id:cat.id, images: art.images}
                                }
                            }
                    }
                })
               
           })
       })
       return categories
    }

    const sortCategories = ( obj ) => {
        let sortable = []
        for(const genre in obj){
            sortable.push([genre, obj[genre].images, obj[genre].id, obj[genre].total])
        }
        sortable.sort((a,b) => {
            return b[2] - a[2]
        })
        let newArr = []
        sortable.map((item, i) => {
            newArr.push({ name: capital( item[0] ), id: item[2] , type: 'category' ,  images: item[1]})
        })
        return newArr
    }

    const dir = searchPageHistoryRef.current.length > 0  ?
    activeSearchItem.id === searchPageHistoryRef.current[ searchPageHistoryRef.current.length - 1].activeItem.id || 
    !activeSearchItem.type ? 
    -1 
    :
    1
    : 
    1

    useEffect(() => {
        if( activeSearchItem.id ){
            if( searchPageHistoryRef.current.length > 0 ){
                if( currActiveSearchRef.current.selectedTrack) currActiveSearchRef.current.selectedTrack = false
                if( searchPageHistoryRef.current[ searchPageHistoryRef.current.length - 1 ].activeItem.id !== activeSearchItem.id ){
                    searchPageHistoryRef.current.push({ activeItem: currActiveSearchRef.current, minHeight: transMinHeight, scroll: Math.round(transMinHeight * (scrollPosition / 100)) })
                } 
            } else {
                searchPageHistoryRef.current.push({ activeItem: currActiveSearchRef.current, minHeight: transMinHeight, scroll: Math.round(transMinHeight * (scrollPosition / 100)) })
            }
        } 
        currActiveSearchRef.current = activeSearchItem
    },[ activeSearchItem ])

    useEffect(() => {
        if( transitionComplete &&
            searchPageHistoryRef.current.length > 0 && 
            activeSearchItem.id === searchPageHistoryRef.current[ searchPageHistoryRef.current.length - 1].activeItem.id ){
            const lastItem = searchPageHistoryRef.current.pop()
            dashboardRef.current.scroll({
                left: 0,
                top: lastItem.scroll - ( window.innerHeight / 2 ),
                behavior: 'auto'
            })
        }else {
            if(transitionComplete){
                dashboardRef.current.scroll({
                    left: 0,
                    top: 0 ,
                    behavior: 'auto'
                })
            }
        }
    },[ activeSearchItem, transitionComplete ]) 

    const pageTransition = useTransition(activeSearchItem, {
        initial: { transform: `translateX(${100 * dir}%)`},
        from: { transform: `translateX(${100 * dir}%)`, position: 'absolute',minHeight: transMinHeight, width: '100%' , zIndex: 2 },
        update: {  position: 'absolute'},
        enter: { transform: `translateX(${0 * dir}%)`, zIndex: 2},
        leave: { transform: `translateX(${-20 * (dir === 1 ? 1 : -5)}%)`, position: 'absolute', zIndex: 1},
        onRest: () => setTransitionComplete(true)
    })

    const headerTransition = useTransition(activeSearchItem, {
        from: { transform: `translateX(${100 * dir }%)`, position: 'fixed', width: '100%' , zIndex: 3 , top: 0},
        update: { position: 'fixed', top: selectOverlay[0] ? dashboardRef.current.scrollTop : 0 , config: { duration: .01 }},
        enter: {  transform: `translateX(${0 * dir }%)` },
        leave: { transform: `translateX(${-100 * dir }%)`},
    })

    const headerTransition2 = useTransition(activeSearchItem, {
        from: { transform: `translateX(${0}%)`, position: 'fixed', width: '100%', zIndex: 3},
        update: { position: 'fixed' },
        enter: { transform: `translateX(${0}%)`, },
        leave: { transform: `translateX(${-100 * dir }%)`,  position: 'fixed', zIndex: 1},
    })
    
    const mainTransition = useTransition(activeSearchItem, {
        from: { transform: `'translateX(${ 0 * dir }%)'`, position: 'absolute', minHeight: transMinHeight,  width: '100%' , zIndex: 2},
        update: {  position: 'absolute'},
        enter: { transform: `'translateX(${ 0 * dir }%)'`, },
        leave: { transform: `'translateX(${ -20 * dir }%)'`, position: 'absolute', zIndex: 1},
    })

    const overlayTrans = useTransition( searchState , {
        initial: { opacity: 0 },
        from: { opacity: 0, transform: 'translateX(0%)' },
        enter: { opacity: 1 },
        leave: item => !activeSearchItem.type || activeSearchItem.type === 'showcase' ? { opacity: 0 } : { transform: 'translateX(-100%' }
    })

    return(
        <SearchHookContext.Provider value={ searchHookState }>   

        <div id='searchPage' style={{ position: 'relative'}} >
            {
                overlayTrans(( props, item ) => (
                    item === 'search' &&
                    <SearchOverlay 
                    setActiveItem={ setActiveSearchItem } 
                    style={ props } 
                    searchState={ searchState } 
                    setSearchState={ setSearchState }/>
                    
                ))
            }
            {
                headerTransition2(( props, item ) => (
                    <animated.div style={ props }>
                    {
                        !item.type &&
                        <SearchHeader /> 
                    }
                    {
                        item.type === 'category' &&
                        <SearchHeader /> 
                    }
                    </animated.div>
                ))
            } 
            
            <SearchPageSettingsContext.Provider value={ searchPageSettingsState } >
            {
                headerTransition(( props, item )=> (
                    (item.type === 'artist' ||
                    item.type === 'playlist' ||
                    item.type === 'album') &&
                    <FixedHeader style={ props } page={'search'} />
                ))
            }
            {
                mainTransition((props, item) => (
                    !item.type  &&
                    <SearchHome 
                    style={ props } />
                ))
            }
            {
                pageTransition((props, item) => (   
                item.type === 'category' ?
                <Showcase
                style={ props } 
                data={ item } /> 
                :
                item.type === 'artist' ?
                <Artist 
                style={ props }
                page='search'
                data={ item }  />
                :
                item.type === 'album' ?
                <Collection
                style={ props }
                type='album'
                page='search' 
                data={ item } />
                :
                item.type === 'playlist' &&
                <Collection
                style={ props }
                type='playlist'
                page='search' 
                data={ item } />
                ))
                }
            </SearchPageSettingsContext.Provider>
            
        </div>    

        
        </SearchHookContext.Provider>
    )
}

export default Search