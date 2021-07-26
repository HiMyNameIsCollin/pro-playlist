import { useState, useEffect } from 'react'
import { animated } from 'react-spring'
import Slider from '../Slider'
import ActiveItem from './ActiveItem'


const PlaylistContainer = ({ style, data, setData }) => {


    return(
        <animated.div
        style={ style } 
        className='playlistContainer' >
            {
                data.id === 'test' ?
                <Slider message={ 'Your playlists' } items={ data.items } setActivePlaylist={ setData } /> :
                <div>
                <h1> Test</h1>
                <h1> Test</h1>
                <h1> Test</h1>
                <h1> Test</h1>
                <h1> Test</h1>

                </div>
            }
 
        </animated.div>
    )
}

export default PlaylistContainer