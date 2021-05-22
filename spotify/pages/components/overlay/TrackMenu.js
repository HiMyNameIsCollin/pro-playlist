
const TrackMenu = ({ data, overlay, setOverlay, setActiveItem }) => {

    const handleViewArtist = ( e, index ) => {
        e.stopPropagation()
        e.preventDefault()
        if( data.tracks.items[index].artists.length === 1){
            setActiveItem(data.tracks.items[index].artists[0])
        }else {
            const popupData = {
                title: 'Choose Artist',
                array: data.tracks.items[index].artists
            }
            setOverlay({ type: 'listMenu' , data: popupData, func: setActiveItem })
        }
        
    }

    return(
        <div className='popup__trackMenu'>
            <button>
                <i class="fas fa-share-alt"></i> 
                <span> Share</span>
            </button>
            <button onClick={ (e) => handleViewArtist(e, data.trackIndex)} >
                <i class="far fa-eye"></i>
                <span> View artist </span> 
            </button>
            <button>
                <i class="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
        </div>
    )
} 

export default TrackMenu