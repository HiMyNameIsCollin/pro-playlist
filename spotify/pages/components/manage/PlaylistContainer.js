import { useState, useEffect } from 'react'
import { animated } from 'react-spring'
import Slider from '../Slider'


const PlaylistContainer = ({ style, data }) => {

    const [ activePlaylist, setActivePlaylist ] = useState( {} )

    return(
        <animated.div
        style={ style } 
        className='playlistContainer' >
            <Slider message={ 'Your playlists' } items={ data } setActivePlaylist={ setActivePlaylist } />
        </animated.div>
    )
}

export default PlaylistContainer