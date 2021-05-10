import Slider from './Slider'
import TabsContainer from './TabsContainer'

import { useState, useEffect } from 'react'

const Home = ({  state }) => {
    return(
        <div className='page'>
            <TabsContainer items={ state.recently_played } />
            <Slider type='playlists' items={ state.my_playlists }/>
            <Slider type='albums' items={ state.my_albums }/>
        </div>
    )
}

export default Home