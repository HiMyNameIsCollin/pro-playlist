import Slider from './Slider'
import TabsContainer from './TabsContainer'

import { useState, useEffect } from 'react'

const Home = ({  state , Link }) => {
    return(
        <div className='page'>
            <TabsContainer items={ state.recently_played } />
            <Slider 
            message='New Releases' 
            items={ state.new_releases }
            Link={ Link } />
            <Slider 
            message='Featured playlists' 
            items={ state.featured_playlists }
            Link={ Link }/>
        </div>
    )
}

export default Home