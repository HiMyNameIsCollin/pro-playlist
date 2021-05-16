import Slider from './Slider'
import TabsContainer from './TabsContainer'

import { useState, useEffect } from 'react'

const Home = ({  state , setActive }) => {
    return(
        <div className='page'>
            <TabsContainer items={ state.recently_played } />
            <Slider 
            message='New Releases' 
            items={ state.new_releases }
            setActive={ setActive }/>
            <Slider 
            message='Featured playlists' 
            items={ state.featured_playlists }
            setActive={ setActive }/>
        </div>
    )
}

export default Home