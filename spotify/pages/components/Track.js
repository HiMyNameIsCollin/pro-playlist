import { useState, useLayoutEffect, useContext } from 'react'
import { whichPicture } from '../../utils/whichPicture'
import { DbHookContext } from './Dashboard'


const Track = ({ type, i , track, handleTrackMenu }) => {
    const [ activeTrack, setActiveTrack ] = useState(false)

    const { queue, setQueue } = useContext( DbHookContext )

    useLayoutEffect(() => {
        if( queue[0] && queue[0].id === track.id && type !=='player--collapsed' ){
            setActiveTrack( true )
        }else {
            setActiveTrack( false )
        }
    },[ queue ])

    const playTrack = ( track, arr, func ) =>{
        if(arr[0] && arr[0].id !== track.id) {
            func( arr => arr = [track, ...arr.slice(1, arr.length-1)] )
        }
        
    }

    return(
        <div 
        onClick={ () => type !== 'player--collapsed' ? playTrack(track, queue, setQueue) : console.log(track) }
        className={
            `track ${ activeTrack && 'track--active' }`
        }>
        {/* Ternary operators determine if this is a playlist or an album. */}

        {
            type === 'artist' &&
            <p> { i + 1 } </p> 
        }

        {
            type!=='collection' &&
                <div className='track__imgContainer'>
                    <img
                    alt='Album' 
                    src={ whichPicture( track.album.images, 'sm') }/>
                </div>
        }
            <h5>
                { track.name }
            </h5>
            <span>
                {
                    track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`)
                }
            </span>
            {
                type !== 'player--collapsed' &&
                <i className="fas fa-ellipsis-h"
                onClick={ () => handleTrackMenu( track ) }></i> 
            }

        </div>
    )
}

export default Track