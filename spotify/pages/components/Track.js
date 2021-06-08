
const Track = ({ type, track, handleTrackMenu }) => {
    return(
        <div className='track' >
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
}

export default Track