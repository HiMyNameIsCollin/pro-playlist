
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
        <section className='trackContainer'>
        {
            tracks.map((track, i) => {
                return (
                <div className='track' key={i}>
                    <p>
                        { track.name }
                    </p>
                    <span>
                        { 
                        track.artists.map((artist , j) => j !== track.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }`)
                        }
                    </span>
                    <i onClick={ () => handleTrackMenu(track) } className="fas fa-ellipsis-h"></i>

                </div>
                ) 
            })
        }
        </section>
    )
}

export default TracksContainer 