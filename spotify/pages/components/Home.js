import { Switch, Route } from 'react-router-dom'
import { useState, useEffect, useReducer, useContext, useRef} from 'react'
import { animated, useTransition } from 'react-spring'
import { DbHookContext } from './Dashboard'
import Welcome from './Welcome'
import Artist from './Artist'
import Collection from './Collection'
import HomeHeader from './HomeHeader'
import FixedHeader from './FixedHeader'

const Home = ({ transMinHeight, setTransMinHeight, currActiveHomeRef }) => {

    const { homeHeaderScrolled, setHomeHeaderScrolled, activeHomeItem, homePageHistoryRef, hiddenUI, setAuth, scrollPosition, dashboardRef} = useContext(DbHookContext)
    const [ headerScrolled, setHeaderScrolled ] = useState( 0 )
    const [ activeHeader, setActiveHeader ] = useState( {} )
    const [ transitionComplete, setTransitionComplete ] = useState( false )
    const [ mounted, setMounted ] = useState( false )
    const thisComponentRef = useRef()

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
                    homePageHistoryRef.current.push({ activeItem: currActiveHomeRef.current, minHeight: transMinHeight, scroll: Math.round(transMinHeight * (scrollPosition / 100))  })
                } 
            } else {
                homePageHistoryRef.current.push({ activeItem: currActiveHomeRef.current, minHeight: transMinHeight, scroll: Math.round(transMinHeight * (scrollPosition / 100)) })
            }
        } 
        currActiveHomeRef.current = activeHomeItem
    },[ activeHomeItem ])

    useEffect(() => {
        if( transitionComplete && 
            homePageHistoryRef.current.length > 0 && 
            activeHomeItem.id === homePageHistoryRef.current[ homePageHistoryRef.current.length - 1].activeItem.id){
            const lastItem = homePageHistoryRef.current.pop()
            dashboardRef.current.scroll({
                left: 0,
                top: lastItem.scroll - 160 ,
                behavior: 'auto'
            })
        } else {
            if(transitionComplete){
                dashboardRef.current.scroll({
                    left: 0,
                    top: 0 ,
                    behavior: 'auto'
                })
            }
        }
    },[ activeHomeItem, transitionComplete ])

    useEffect(() => {
        setMounted(true)
    },[])
    
    const pageTransition = useTransition(activeHomeItem, {
        initial: { transform: `translateX(${100 * dir}%)`, },
        from: { transform: `translateX(${100 * dir}%)`, position: 'absolute', minHeight: transMinHeight , width: '100%' , zIndex: 2 },
        enter: { transform: `translateX(${0 * dir}%)`, minHeight: transMinHeight},
        update: {  position: 'absolute' },
        leave: { transform: `translateX(${-20 * (dir === 1 ? 1 : -5)}%)`, position: 'absolute', zIndex: 1},
        onRest: () => setTransitionComplete(true)
        
    })

    const headerTransition = useTransition(activeHomeItem, {
        from: { transform: `translateX(${100 * dir }%)`, position: 'fixed', width: '100%' , zIndex: 3 },
        update: {  position: 'fixed' },
        enter: { transform: `translateX(${0 * dir }%)`},
        leave: { transform: `translateX(${-100 * dir }%)`, position: 'fixed', zIndex: 1},
    })

    const mainTransition = useTransition(activeHomeItem, {
        initial: { transform: `translateX(${0 * dir }%)`, position: 'absolute', width: '100%'},
        from: { transform: `translateX(${0 * dir }%)`, position: 'absolute', minHeight: transMinHeight, width: '100%'},
        enter: { transform: `translateX(${0 * dir }%)`, minHeight: transMinHeight,},
        update: {  position: 'absolute', },
        leave: { transform: `translateX(${-20 * dir }%)`, position: 'absolute'},
        onRest: () => setTransitionComplete(true)
    })


    return(
        <div
        ref={ thisComponentRef }
        id='homePage'>
        {
        headerTransition(( props, item ) => (
            <animated.div style={ props }>
                {
                    item.type &&
                    <FixedHeader 
                    type={ 'home' } 
                    transitionComplete={ transitionComplete } 
                    headerScrolled={ headerScrolled } 
                    activeHeader={ activeHeader } />
                }
            </animated.div>
        ))
        }


        {
        mainTransition(( props, item) => (
            !item.type && 
            <Welcome transition={ props } transitionComplete={ transitionComplete } setTransitionComplete={ setTransitionComplete } setTransMinHeight={ setTransMinHeight } />
            
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
            setHeaderScrolled={ setHeaderScrolled}/>
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
            type='album' />
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
            type='playlist' />
                
        ))
        }
        
        </div>
    )


}

export default Home