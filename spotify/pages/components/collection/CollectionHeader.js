import { useEffect } from 'react'
import { whichPicture } from '../../../utils/whichPicture'
import { capital } from '../../../utils/capital'


const CollectionHeader = ({ data , setOverlay, setActiveItem }) => {
    const { collection, tracks } = { ...data }

    return(
        <header className='collection__header'>
            <div className='collection__imgContainer'>
                <img src={ whichPicture(collection.images, 'med') } />
            </div> 
            <h1> { collection.name } </h1>
            
            <div className='collection__artists'>
            {
                collection.artists.length === 1 &&
                <img
                height='32px'
                width='32px' 
                src={ whichPicture(collection.artists[0].images, 'sm' ) } 
                alt='Artist' />
            }
                <p onClick={
                    (e) => handleViewArtist( e, collection.artists, setOverlay, setActiveItem ) }>
                    { collection.artists.map((artist, i) =>  i !== collection.artists.length - 1 ? `${ artist.name }, ` : `${ artist.name }` ) }
                    </p>

            </div>  
            <div className='collection__info'>
                <span>
                    { capital( collection.album_type ) }  
                </span>
                ||
                <span>
                    { collection.release_date.substr(0,4) }
                </span>
            </div>  
        </header>
    )   
}

export default CollectionHeader