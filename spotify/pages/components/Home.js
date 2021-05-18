import Slider from './Slider'
import TabsContainer from './TabsContainer'

import { useState, useEffect } from 'react'

const Home = ({  state , dispatch  }) => {
    return(
        <div className='page'>
            <TabsContainer items={ state.recently_played } />
            <Slider 
            message='New Releases' 
            items={ state.new_releases }
            dispatch={ dispatch } />
            <Slider 
            message='Featured playlists' 
            items={ state.featured_playlists }
            dispatch={ dispatch } />
        </div>
    )
}

export default Home