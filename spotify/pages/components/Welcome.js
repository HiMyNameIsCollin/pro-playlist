import { useContext } from 'react'
import Slider from './Slider'
import TabsContainer from './TabsContainer'
import { DbHookContext } from './Dashboard'

const Welcome = ({ state }) => {

    const { setActiveItem, } = useContext(DbHookContext)

    return(
        <div className='page page--welcome'>

            <TabsContainer items={ state.recently_played }  />
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

export default Welcome