import { Switch, Route } from 'react-router-dom'
import { useState, useEffect, useReducer, useContext, useRef} from 'react'
import { animated, useTransition } from 'react-spring'
import { DbHookContext } from './Dashboard'
import Welcome from './Welcome'
import Artist from './Artist'
import Collection from './Collection'
import HomeHeader from './HomeHeader'
import FixedHeader from './FixedHeader'

const Home = ({ currActiveHomeRef, state }) => {

    const { homeHeaderScrolled, setHomeHeaderScrolled, activeHomeItem, homePageHistoryRef, hiddenUI, setAuth, scrollPosition } = useContext(DbHookContext)
    const [ headerScrolled, setHeaderScrolled ] = useState( 0 )
    const [ activeHeader, setActiveHeader ] = useState( {} )
    const [ transMinHeight, setTransMinHeight ] = useState( 0 )
    const [ transitionComplete, setTransitionComplete ] = useState( false )
    const [ mounted, setMounted ] = useState( false )
    const welcomePageRef = useRef() 
    const artistPageRef = useRef()
    const collectionPageRef = useRef()
    
    const dir = homePageHistoryRef.current.length > 0  ?
    activeHomeItem.id === homePageHistoryRef.current[ homePageHistoryRef.current.length - 1].activeItem.id || 
    !activeHomeItem.type ? 
    -1 
    :
    1
    : 
    1

    useEffect(() => {
        if( activeHomeItem.id ){
            if( homePageHistoryRef.current.length > 0 ){
                if( currActiveHomeRef.current.selectedTrack) currActiveHomeRef.current.selectedTrack = false
                if( homePageHistoryRef.current[ homePageHistoryRef.current.length - 1 ].activeItem.id !== activeHomeItem.id ){
                    homePageHistoryRef.current.push({ activeItem: currActiveHomeRef.current, minHeight: transMinHeight, scroll: scrollPosition })
                } 
            } else {
                
                homePageHistoryRef.current.push({ activeItem: currActiveHomeRef.current, minHeight: transMinHeight, scroll: scrollPosition })
            }
        } else if( !activeHomeItem.id && mounted ){
            
        }
        currActiveHomeRef.current = activeHomeItem
    },[ activeHomeItem ])

    useEffect(() => {
        if( homePageHistoryRef.current.length > 0 && activeHomeItem.id === homePageHistoryRef.current[ homePageHistoryRef.current.length - 1].activeItem.id ){
            const lastItem = homePageHistoryRef.current.pop()
            // window.scroll({
            //     x: 0,
            //     y: lastItem.scroll,
            //     behavior: 'auto'
            // })
        }
    },[ ])

    useEffect(() => {
        setMounted(true)
    },[])
    
    const pageTransition = useTransition(activeHomeItem, {
        initial: { transform: `translateX(${100 * dir}%)`, },
        from: { transform: `translateX(${100 * dir}%)`, position: 'absolute', minHeight: transMinHeight , width: '100%' , zIndex: 2 },
        enter: { transform: `translateX(${0 * dir}%)`},
        update: {  position: 'absolute'},
        leave: { transform: `translateX(${-20 * (dir === 1 ? 1 : -5)}%)`, position: 'absolute', zIndex: 1},
        onRest: () => setTransitionComplete(true)
        
    })

    const headerTransition = useTransition(activeHomeItem, {
        from: { transform: `translateX(${100 * dir }%)`, position: 'fixed', width: '100%' , zIndex: 3 },
        update: {  position: 'fixed',},
        enter: { transform: `translateX(${0 * dir }%)`},
        leave: { transform: `translateX(${-100 * dir }%)`, position: 'fixed', zIndex: 1},
    })

    const mainTransition = useTransition(activeHomeItem, {
        from: { transform: `translateX(${0 * dir }%)`, position: 'absolute', minHeight: transMinHeight, width: '100%'},
        enter: { transform: `translateX(${0 * dir }%)`},
        update: {  position: 'absolute' },
        leave: { transform: `translateX(${-20 * dir }%)`, position: 'absolute'},
        onRest: () => setTransitionComplete(true)
    })


    return(
        <div
        id='homePage'>
        {
        headerTransition(( props, item ) => (
            <animated.div style={ props }>
                {
                    !item.type &&
                    <HomeHeader hiddenUI={ hiddenUI } setAuth={ setAuth } />
                }
                {
                    item.type === 'artist' &&
                    <FixedHeader type={ 'Home' } headerScrolled={ headerScrolled } activeHeader={ activeHeader } />
                }
                {
                    item.type === 'album' &&
                    <FixedHeader type={ 'Home' } headerScrolled={ headerScrolled } activeHeader={ activeHeader } />
                }
                {
                    item.type === 'playlist' &&
                    <FixedHeader type={ 'Home' } headerScrolled={ headerScrolled } activeHeader={ activeHeader } />
                }
            </animated.div>
        ))
        }


        {
        mainTransition(( props, item) => (
            !item.type && 
            
            <Welcome transition={ props } transitionComplete={ transitionComplete } setTransitionComplete={ setTransitionComplete } setTransMinHeight={ setTransMinHeight } state={ state } />
            
        ))
        }
        {
        pageTransition(( props, item) => (
            
                
            item.type === 'artist' ?
            <Artist 
            setTransMinHeight={ setTransMinHeight }
            transitionComplete={ transitionComplete }
            setTransitionComplete={ setTransitionComplete }
            transition={ props }
            activeHeader={ activeHeader }
            setActiveHeader={ setActiveHeader }
            headerScrolled={ headerScrolled }
            setHeaderScrolled={ setHeaderScrolled}
            genreSeeds={ state.available_genre_seeds}/>
            :
            item.type === 'album' ?
            <Collection
            setTransMinHeight={ setTransMinHeight }
            transitionComplete={ transitionComplete }
            setTransitionComplete={ setTransitionComplete }
            transition={ props }
            activeHeader={ activeHeader }
            setActiveHeader={ setActiveHeader }
            headerScrolled={ headerScrolled }
            setHeaderScrolled={ setHeaderScrolled}
            type='album'
            genreSeeds={ state.available_genre_seeds } />
            :
            item.type === 'playlist' &&
            <Collection
            setTransMinHeight={ setTransMinHeight }
            transitionComplete={ transitionComplete }
            setTransitionComplete={ setTransitionComplete }
            transition={ props }
            activeHeader={ activeHeader }
            setActiveHeader={ setActiveHeader }
            headerScrolled={ headerScrolled }
            setHeaderScrolled={ setHeaderScrolled}
            type='playlist'
            genreSeeds={ state.available_genre_seeds } />
                
                        
            
        ))
        }
        
        </div>
    )


}

export default Home