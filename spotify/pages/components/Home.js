import Slider from './Slider'
import TabsContainer from './TabsContainer'
import Loading from './Loading'

import { useState, useEffect, useContext } from 'react'
import { DbHookContext } from './Dashboard'

const Home = ({  state  }) => {

    const { setActiveItem } = useContext(DbHookContext)
    const [ tabsMounted, setTabsMounted ] = useState( false )
    const [ loaded, setLoaded ] = useState( false )
    useEffect(() => {
        if( tabsMounted ) setTimeout(() => setLoaded( true ), 500)
    }, [ tabsMounted ])

    return(
        <div className='page page--home'>
            {
                !loaded &&
                <Loading loaded={ loaded }/> 
            }    
            <TabsContainer items={ state.recently_played } setTabsMounted={ setTabsMounted } />
            <Slider 
            message='New Releases' 
            items={ state.new_releases }
            setActiveItem={ setActiveItem } />
            <Slider 
            message='Featured playlists' 
            items={ state.featured_playlists }
            setActiveItem={ setActiveItem } /> 
        </div>
    )
}

export default Home