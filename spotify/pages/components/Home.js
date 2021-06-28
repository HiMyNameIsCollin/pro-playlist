import { Switch, Route, useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect, useReducer, useContext, Redirect} from 'react'
import { animated, useTransition } from 'react-spring'
import { DbHookContext } from './Dashboard'
import Welcome from './Welcome'
import Artist from './Artist'
import Collection from './Collection'
import HomeHeader from './HomeHeader'
import FixedHeader from './FixedHeader'

const Home = ({  state  }) => {

    const { activeItem, setActiveItem, homeHeaderScrolled, setHomeHeaderScrolled, hiddenUI, setAuth, location } = useContext(DbHookContext)
    const [ headerScrolled, setHeaderScrolled ] = useState( 0 )
    const [ activeHeader, setActiveHeader ] = useState( {} )

    const pageTransition = useTransition(location, {
        initial: { transform: 'translateX(100%)', },
        from: { transform: 'translateX(100%)', position: 'absolute', width: '100%' , zIndex: 2 },
        update: {  position: 'relative'},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: 'translateX(-20%)', position: 'absolute', zIndex: 1},
    })

    const headerTransition = useTransition(location, {
        from: { transform: 'translateX(100%)', position: 'fixed', width: '100%' , zIndex: 3 },
        update: {  position: 'fixed'},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: 'translateX(-100%)', position: 'fixed'},
    })

    const mainTransition = useTransition(location, {
        from: { transform: 'translateX(0%)', position: 'absolute', width: '100%'},
        update: {  position: 'relative'},
        enter: { transform: 'translateX(0%)' },
        leave: { transform: 'translateX(-20%)', position: 'absolute', zIndex: 1},
    })

    return(
        <div>
        {
        headerTransition(( props, item) => (
            <animated.div style={props}>
                <Switch location={ item }>
                    <Route exact path='/'>
                        <HomeHeader hiddenUI={ hiddenUI } setAuth={ setAuth } />
                    </Route>
                    <Route path='/artist/:id'>
                        <FixedHeader headerScrolled={ headerScrolled } activeHeader={ activeHeader } />
                    </Route>
                    <Route path='/playlist/:id'>
                        <FixedHeader headerScrolled={ headerScrolled } activeHeader={ activeHeader } />
                    </Route>
                    <Route path='/album/:id'>
                        <FixedHeader headerScrolled={ headerScrolled } activeHeader={ activeHeader } />
                    </Route>
                </Switch>
            </animated.div>
        ))
        }

        {
        mainTransition(( props, item) => (
            <animated.div style={props}>
                <Switch>
                    <Route exact path='/'>
                        <Welcome state={ state } />
                    </Route>
                </Switch>
            </animated.div>
        ))
        }
        {
        pageTransition(( props, item) => (
            <animated.div style={ props }>
                <Switch location={ item }>
                    <Route path='/artist/:id'>
                        <Artist 
                        activeHeader={ activeHeader }
                        setActiveHeader={ setActiveHeader }
                        headerScrolled={ headerScrolled }
                        setHeaderScrolled={ setHeaderScrolled}
                        genreSeeds={ state.available_genre_seeds}
                        location={ location }/>
                    </Route> 
                    <Route path='/album/:id'>
                        <Collection
                        activeHeader={ activeHeader }
                        setActiveHeader={ setActiveHeader }
                        headerScrolled={ headerScrolled }
                        setHeaderScrolled={ setHeaderScrolled}
                        type='album'
                        genreSeeds={ state.available_genre_seeds } />
                    </Route>
                    <Route path='/playlist/:id'>
                        <Collection
                        activeHeader={ activeHeader }
                        setActiveHeader={ setActiveHeader }
                        headerScrolled={ headerScrolled }
                        setHeaderScrolled={ setHeaderScrolled}
                        type='playlist'
                        genreSeeds={ state.available_genre_seeds } />
                    </Route> 
                </Switch>   
            </animated.div>
        ))
        }
        
        </div>
    )


}

export default Home