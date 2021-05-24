import Image from 'next/image'
import { handleViewArtist } from '../../../utils/handleViewArtist'

const TrackMenu = ({ data, overlay, setOverlay, setActiveItem }) => {

    const { selectedTrack } = data

    const copyToClip = (track) => {
        // ILL BE BACK FOR THIS ONCE I FIGURE IF I WANNA SHARE ON SPOTIFY OR MY APP
    }

    const openSpotify = ( url ) => {
        window.open( url )
    }

    return(
        <div className='popup__trackMenu'>
            <button onClick={ () => openSpotify( selectedTrack.external_urls.spotify )} >
                <Image 
                src='/Spotify_Icon_RGB_Green.png'
                alt='View via Spotify' 
                height='32px'
                width='32px'/>
                <span> View via Spotify </span>
            </button>
            <button onClick={ () => copyToClip( selectedTrack ) }>
                <i className="fas fa-share-alt"></i> 
                <span> Share </span>
            </button>
            <button onClick={ (e) => handleViewArtist( e , selectedTrack.artists, setOverlay, setActiveItem)} >
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