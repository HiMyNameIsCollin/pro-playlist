import { useState, useEffect, useContext, useRef, createContext } from 'react'
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

    
    const { scrollPosition, selectOverlay, dashboardRef, activeSearchItem, setActiveSearchItem, hiddenUI } = useContext( DbHookContext )
    const { all_categories, my_top_artists, available_genre_seeds, my_top_categories  } = useContext( DbFetchedContext )

    useEffect(() => {
        if( (!activeSearchItem.type || activeSearchItem.type === 'category' )){
            setTransitionComplete( true )
        }
    },[])

    // CREATES A TOP GENRES ARRAY BECAUSE SPOTIFY WONT GIVE US A ROUTE FOR IT :(
    useEffect(() => {
        let isMounted = true 
        if( isMounted ){
            if(my_top_artists.length > 0 && all_categories.length > 0 && my_top_categories.length === 0) {
                let topArtists = [...my_top_artists]
                const categories = calcCategories(topArtists)
                const sortedCats = sortCategories( categories )
                const payload = {
                    route: 'categories',
                    items: sortedCats
                }
                dbDispatch(payload)
            }
        }
        
        return () => isMounted = false 
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
        if( activeSearchItem.type ){
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


    const handleScrollHistory = () => {
        if( searchPageHistoryRef.current.length > 0 && 
            activeSearchItem.id === searchPageHistoryRef.current[ searchPageHistoryRef.current.length - 1].activeItem.id ){
            const lastItem = searchPageHistoryRef.current.pop()
            dashboardRef.current.scroll({
                left: 0,
                top: lastItem.scroll - ( window.innerHeight / 2 ),
                behavior: 'auto'
            })
        }else {
            dashboardRef.current.scroll({
                left: 0,
                top: 0 ,
                behavior: 'auto'
            })
        }
    }


    const [ zCounter, setZCounter ] = useState( 2 )

    const handleZ = () => {
        if( activeSearchItem.type ){
            setZCounter( z => z += 1 )
        } else {
            setZCounter(2)
        }
    }

    const pageTransition = useTransition(activeSearchItem, {
        from: { transform: `translateX(${100 * dir}%)`,  position: 'absolute', width: '100%' ,top: 0 },
        enter: { 
        transform: `translateX(${0 * dir }%)`, 
        zIndex: zCounter + 1  , 
        minHeight: transMinHeight ,
        pointerEvents: 'auto',
        delay: 250 , 
        onRest: () => {
            if( activeSearchItem.type ){
                setTransitionComplete( true )
                handleZ()
            }
        }},
        update: {  
            zIndex: zCounter  ,
        },
        leave: { transform: `translateX(${-20 * dir }%)`, pointerEvents: 'none',  zIndex: 1,},
        
    })
    
    const headerTransition = useTransition(activeSearchItem, {
        from: { transform: `translateX(${100 * dir }%)`, position: 'fixed', width: '100%' ,top: 0, zIndex: zCounter + 2},
        update: { top: selectOverlay[0] ? dashboardRef.current.scrollTop : 0 ,  config: { duration: .01 }},
        enter: {  transform: `translateX(${0 * dir }%)`, pointerEvents: 'auto', delay: 250 },
        leave: { transform: `translateX(${-20 * dir }%)`, pointerEvents: 'none', zIndex: zCounter },
        expires: 10000,
    })

    const headerTransition2 = useTransition(activeSearchItem, {
        from: { transform: `translateY(${ -100 }%)`, position: 'fixed', width: '100%' ,top: 0, zIndex: zCounter + 2},
        update: { 
            top: !hiddenUI && searchState !== 'search' ? 0 : selectOverlay[0] ? dashboardRef.current.scrollTop : ( 4 * -16 - 8 ),
            opacity: searchState === 'search' ? 0 : 1,
            pointerEvents: searchState === 'search' ? 'none' : 'auto'
        },
        enter: {  transform: `translateY(${0}%)`, pointerEvents: 'auto', delay: 250 },
        leave: { transform: `translateY(${-100 }%)`, pointerEvents: 'none', zIndex: zCounter + 2 },
    })

    const mainTransition = useTransition(activeSearchItem, {
        from: { transform: `translateX(${ (dir < 0 ? 100 : 0) * dir }%)`,  top: 0},
        enter: { 
            transform: `translateX(${0 * dir }%)`, 
            minHeight: transMinHeight < window.innerHeight ? window.innerHeight : transMinHeight, 
            position: 'absolute', 
            pointerEvents: 'auto',
            width: '100%',  
            zIndex: zCounter + 1, 
            delay: 250 , 
            onRest: () => {
                if( !activeSearchItem.type ){
                    setTransitionComplete( true )
                    handleZ()
                }
            }  
        },
        update: { 
            zIndex: zCounter + 1 ,
        },
        leave: { transform: `translateX(${-20 * dir }%)`, pointerEvents: 'none', zIndex: 1, },

    })

    const overlayTrans = useTransition( searchState , {
        initial: { opacity: 0 },
        from: { opacity: 0, transform: 'translateX(0%)', zIndex: zCounter + 2 },
        enter: { opacity: 1, delay: 250 },
        leave: item => async( next, cancel ) => {
            if( !activeSearchItem.type || activeSearchItem.type === 'category' ){
                await next( { opacity: 0 , delay: 250} )
            }else {
                await next( { transform: 'translateX(-100%)', delay: 250  })
            }
        }
    })

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
        setTransMinHeight,
        handleScrollHistory
    }

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
            
            
            <SearchPageSettingsContext.Provider value={ searchPageSettingsState } >
            {
                headerTransition2(( props, item ) => (
                    
                        !item.type ?
                        <SearchHeader style={ props } /> 
                        :
                        item.type === 'category' &&
                        <SearchHeader  style={ props }/>
                    
                ))
            } 
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