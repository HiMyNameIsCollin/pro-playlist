import Slider from './Slider'
import TabsContainer from './TabsContainer'

import { useState, useEffect } from 'react'


const Home = ({  state , setActiveItem  }) => {
    return(
        <div className='page page--home'>
            <TabsContainer items={ state.recently_played } />
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