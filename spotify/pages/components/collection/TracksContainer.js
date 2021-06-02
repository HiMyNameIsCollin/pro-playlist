
const TracksContainer = ({ data , setOverlay }) => {

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
        <section className='collection__trackContainer'>
        {
            tracks.map((track, i) => {
                return (
                <div className='track' key={i}>
                    {/* Ternary operators determine if this is a playlist or an album. */}
                    <p>
                        { track.name ? track.name : track.track.name }
                    </p>
                    <span>
                        { 
                        collection.type !== 'playlist' ?
                        track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`) :
                        track.track.artists.map((artist , j) => j !== track.track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`) 
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