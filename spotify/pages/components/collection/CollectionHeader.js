import { useEffect } from 'react'
import { whichPicture } from '../../../utils/whichPicture'
import { handleViewArtist } from '../../../utils/handleViewArtist'
import { capital } from '../../../utils/capital'


const CollectionHeader = ({ data , setOverlay, setActiveItem }) => {
    const { collection, artists, tracks } = { ...data }

    return(
        <header className='collection__header'>
            <div className='collection__imgContainer'>
                <img src={ whichPicture(collection.images, 'med') } />
            </div> 
            <h1> { collection.name } </h1>
            
            <div className='collection__artists'>
            {
                artists &&
                artists.length === 1 ?
                <img
                height='32px'
                width='32px' 
                src={ whichPicture(artists[0].images, 'sm' ) } 
                alt='Artist' /> :
                null
            }
                <p onClick={
                    (e) => handleViewArtist( e, artists, setOverlay, setActiveItem ) }>
                    { artists.map((artist, i) =>  (
                        i !== artists.length - 1 ? 
                        `${ artist.name ? artist.name : artist.display_name }, ` : 
                        `${ artist.name ? artist.name : artist.display_name }` 
                    ))
                    }
                    </p>

            </div>  
            <div className='collection__info'>
                <span>
                    {/* Ternary operators determine if this is a playlist or an album. */}
                    { collection.type === 'playlist' ? `${collection.followers.total} followers` : capital( collection.album_type ) }  
                </span>
                {
                    collection.type ==='playlist' ?
                    <p> 
                        { collection.description }
                    </p> :
                    <>
                        <i className="fas fa-dot-circle"></i>
                        <span>
                        { collection.release_date.substr(0,4) }
                        </span>
                    </> 

                }
                
            </div>  
        </header>
    )   
}

export default CollectionHeader