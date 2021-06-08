import Image from 'next/image'
import { whichPicture } from '../../../utils/whichPicture'

import { handleViewArtist } from '../../../utils/handleViewArtist'

const TrackMenu = ({ overlay, setOverlay, setActiveItem }) => {

    const { type, data, func } = { ...overlay}
    const { selectedTrack, calledFrom, collection } = {...data}
    const copyToClip = (track) => {
        // ILL BE BACK FOR THIS ONCE I FIGURE IF I WANNA SHARE ON SPOTIFY OR MY APP
    }

    const openSpotify = ( e , url ) => {
        e.stopPropagation()
        window.open( url )
    }

    return(
        <div className='popup__trackMenu'>
            <header className='popup__header'>
                <div className='popup__imgContainer'>
                    <img
                    alt='Track art' 
                    src={ whichPicture( 
                        selectedTrack.album  ?
                        selectedTrack.album.images :
                        collection.images , 'med' )} />
                </div>
                <h3> 
                    { selectedTrack.name }
                </h3>
                <p>
                { 
                    selectedTrack.album ?
                    selectedTrack.album.artists.map((artist, i) =>  (
                            i !== selectedTrack.album.artists.length - 1 ? 
                            `${ artist.name ? artist.name : artist.display_name }, ` : 
                            `${ artist.name ? artist.name : artist.display_name }` 
                        )) :
                    collection.artists.map((artist, i) => (
                            i !== collection.artists.length - 1 ? 
                            `${ artist.name ? artist.name : artist.display_name }, ` : 
                            `${ artist.name ? artist.name : artist.display_name }` 
                        ))
                }
                </p>
            </header>
            
            <button onClick={ (e) => openSpotify(e, selectedTrack.external_urls.spotify )} >
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
            {
               calledFrom !== 'artist' &&
               <button onClick={ (e) => handleViewArtist( e , selectedTrack.artists, setOverlay, setActiveItem)} >
                    <i className="far fa-eye"></i>
                    <span> View artist </span> 
                </button>
            }
            {
                calledFrom === 'collection' && 
                collection.album_type === 'playlist' ||
                calledFrom !== 'collection' &&
                <button onClick={ () => setActiveItem( selectedTrack.album )}>
                    <i className="far fa-eye"></i>
                    <span> View album </span>
                </button>
            }
               
            
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
            <button>
                <i className="far fa-plus-square"></i>
                <span>Add song to Standby playlist</span>
            </button>
        </div>
    )
} 

export default TrackMenu