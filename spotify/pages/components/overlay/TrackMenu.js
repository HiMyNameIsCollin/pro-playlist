
const TrackMenu = ({ data }) => {
    return(
        <div className='popup__trackMenu'>
            <button>
                <i class="fas fa-share-alt"></i> 
                <span> Share</span>
            </button>
            <button>
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