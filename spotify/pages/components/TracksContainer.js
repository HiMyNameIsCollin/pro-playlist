import { whichPicture } from '../../utils/whichPicture'
const TracksContainer = ({ type, data , setOverlay }) => {

    const { collection, tracks } = { ...data }

    const handleTrackMenu = ( selectedTrack ) => {
        const popupData = {
            collection, 
            tracks,
            selectedTrack,
        }
        setOverlay( {type: 'trackMenu', data: popupData, func: null} )
    }

    return(
        <section className={ `${type}__trackContainer`}>
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
                        <img
                            alt='Album' 
                            src={ whichPicture( track.album.images, 'sm')}/>
                    }
                    <p>
                        { track.name ? track.name : track.track.name }
                    </p>
                    <span>
                        {
                        type ==='collection' ?
                        collection.type !== 'playlist' ?
                        track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`) :
                        track.track.artists.map((artist , j) => j !== track.track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`):
                        track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`)  
                        }
                    </span>
                    <i onClick={ () => handleTrackMenu( collection.type === 'playlist' ? track.track : track ) } className="fas fa-ellipsis-h"></i>

                </div>
                ) 
            })
        }
        </section>
    )
}

export default TracksContainer 