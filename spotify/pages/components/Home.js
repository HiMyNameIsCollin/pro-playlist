import { useState, useEffect, createContext, useContext, useRef} from 'react'
import { useTransition } from 'react-spring'
import { DbHookContext } from './Dashboard'
import Welcome from './Welcome'
import Artist from './artist/Artist'
import Collection from './collection/Collection'
import FixedHeader from './FixedHeader'

export const HomePageSettingsContext = createContext()

const Home = ({ transMinHeight, setTransMinHeight, currActiveHomeRef }) => {

    const { activeHomeItem, homePageHistoryRef, scrollPosition, dashboardRef, selectOverlay} = useContext(DbHookContext)
    const [ headerScrolled, setHeaderScrolled ] = useState( 0 )
    const [ activeHeader, setActiveHeader ] = useState( {} )
    const [ transitionComplete, setTransitionComplete ] = useState( false )
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

    const handleScrollHistory = () => {
        if( homePageHistoryRef.current.length > 0 && 
            activeHomeItem.id === homePageHistoryRef.current[ homePageHistoryRef.current.length - 1].activeItem.id){
            const lastItem = homePageHistoryRef.current.pop()
            dashboardRef.current.scroll({
                left: 0,
                top: lastItem.scroll - ( window.innerHeight / 2 ) ,
                behavior: 'auto'
            })
        } else {
            dashboardRef.current.scroll({
                left: 0,
                top: 0 ,
                behavior: 'auto'
            })
        }
    }

    const homePageSettingsState = {
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
    
    const zCounter = useRef( 1 )

    useEffect(() => {
        if( activeHomeItem.type ){
            zCounter.current += 1
        } else {
            zCounter.current = 1
        }
    },[ activeHomeItem ])

    const pageTransition = useTransition(activeHomeItem, {
        from: { transform: `translateX(${100 * dir}%)`, minHeight: transMinHeight , position: 'absolute', width: '100%' , zIndex: zCounter.current + 1 },
        enter: { transform: `translateX(${0 * dir }%)`, delay: 250 , onRest: () => setTransitionComplete( true ) },
        update: {  position: 'absolute', },
        leave: { transform: `translateX(${-20 * dir }%)`, position: 'absolute' , zIndex: zCounter.current },
        
    })
    
    const headerTransition = useTransition(activeHomeItem, {
        from: { transform: `translateX(${100 * dir }%)`, position: 'fixed', width: '100%' , zIndex: zCounter.current + 2 , top: 0},
        update: { position: 'fixed', top: selectOverlay[0] ? dashboardRef.current.scrollTop : 0 , config: { duration: .01 }},
        enter: {  transform: `translateX(${0 * dir }%)`, delay: 250 },
        leave: { transform: `translateX(${-20 * dir }%)`, zIndex: zCounter.current},
        expires: 10000,
    })

    const mainTransition = useTransition(activeHomeItem, {
        from: { transform: `translateX(${ 100 * dir}%)`, zIndex: zCounter.current + 1 , minHeight: transMinHeight < window.innerHeight ? window.innerHeight : transMinHeight, position: 'absolute', width: '100%'},
        enter: { transform: `translateX(${0 * dir }%)`, delay: 250 , onRest: () => setTransitionComplete( true )  },
        update: {  position: 'absolute', zIndex: !activeHomeItem.type && 1 },
        leave: { transform: `translateX(${-20 * dir }%)`, position: 'absolute', zIndex: 1, },

    })

    return(
        <div
        ref={ thisComponentRef }
        id='homePage'>

        <HomePageSettingsContext.Provider value={ homePageSettingsState }>
        {
            headerTransition(( props, item ) => (
                item.type &&
                <FixedHeader 
                style={ props }
                page={ 'home' } />
            ))
        }
        {
            mainTransition(( props, item) => (
                !item.type && 
                <Welcome style={ props } />
                
            ))
            }
            {
            pageTransition(( props, item) => (
                item.type === 'artist' ?
                <Artist 
                style={ props }
                data={ item } 
                page='home' />
                :
                item.type === 'album' ?
                <Collection
                style={ props }
                type='album'
                page='home'
                data={ item } />
                :
                item.type === 'playlist' &&
                <Collection
                style={ props }
                type='playlist' 
                page='home' 
                data={ item } />
                    
        ))
        }
        </HomePageSettingsContext.Provider>
        </div>
    )


}

export default Home