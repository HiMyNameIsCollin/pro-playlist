import { calculateTotalDuration } from '../../utils/calculateTotalDuration'
import { whichPicture } from '../../utils/whichPicture'
const CollectionMeta = ({pageType, data , setOverlay , setActiveItem }) => {

    const { collection, artists, tracks } = {...data}

    const handleViewArtist = (e) => {
        e.stopPropagation()
        if( collection.artists.length === 1 ){
            setActiveItem( collection.artists[0] )
        } else {
            const calledFrom = 'collection'
            setOverlay( {type: calledFrom, pageType: pageType, data: { artists: collection.artists }} )
        }
    }

    return(
        <section className='collection__meta'>

            <p>
                { collection.release_date }
            </p>
            <span>
                {tracks.length} { tracks.length === 1 ? 'track' : 'tracks' }
            </span>
            <i className="fas fa-dot-circle"></i>
            <span>
                { calculateTotalDuration(tracks) }
            </span>

        {
            artists.map((artist, i) => (
                <div key={i} className='collection__meta__artists'>
                    <img
                    height='48px'
                    width='48px' 
                    src={ whichPicture( artist.images, 'sm' ) } 
                    alt='Artist' />
                
                    <p onClick={ handleViewArtist }>
                        { artist.name }
                    </p>

                </div>  
            ))
        }
        </section>       
    )
}

export default CollectionMeta