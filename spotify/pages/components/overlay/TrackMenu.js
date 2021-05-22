import { handleViewArtist } from '../../../utils/handleViewArtist'

const TrackMenu = ({ data, overlay, setOverlay, setActiveItem }) => {

    return(
        <div className='popup__trackMenu'>
            <button>
                <i className="fas fa-share-alt"></i> 
                <span> Share</span>
            </button>
            <button onClick={ (e) => handleViewArtist( e , data.track.artists, setOverlay, setActiveItem)} >
                <i className="far fa-eye"></i>
                <span> View artist </span> 
            </button>
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
        </div>
    )
} 

export default TrackMenu