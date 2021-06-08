import { whichPicture } from '../../utils/whichPicture'
import { useState , useEffect } from 'react'
const TracksContainer = ({ type, data , setOverlay }) => {

    const { collection, tracks } = { ...data }
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    },[])

    const handleTrackMenu = ( selectedTrack ) => {
        const calledFrom = type
        const popupData = {
            calledFrom,
            collection, 
            tracks,
            selectedTrack,
        }
        
        setOverlay( {type: 'trackMenu', data: popupData,  func: null} )
    }

    return(
        <section className={ `${type}__trackContainer trackContainer ${mounted && 'trackContainer--active'}`}>
        {
            type === 'artist' &&
            <h4> Popular </h4> 
        }
        {
            tracks.map((track, i) => {
                return (
                <div className='track' key={i}>
                    {/* Ternary operators determine if this is a playlist or an album. */}
                    {
                        type==='artist' &&
                        <>
                            <p>{i + 1}</p>
                            <div className='track__imgContainer'>
                                <img
                                alt='Album' 
                                src={ whichPicture( track.album.images, 'sm')}/>
                            </div>
                        </>
                    }
                    <h5>
                        { track.name ? track.name : track.track.name }
                    </h5>
                    <span>
                        {
                        type ==='collection' ?
                        collection.type !== 'playlist' ?
                        track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`) :
                        track.track.artists.map((artist , j) => j !== track.track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`):
                        track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`)  
                        }
                    </span>
                    <i className="fas fa-ellipsis-h"
                        onClick={ () => {
                        handleTrackMenu( 
                            type!=='artist' ? 
                            collection.type === 'playlist' ? 
                            track.track : 
                            track : 
                            track) }}></i>

                </div>
                ) 
            })
        }
        </section>
    )
}

export default TracksContainer 