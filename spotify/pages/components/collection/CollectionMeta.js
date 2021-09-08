import { calculateTotalDuration } from '../../../utils/calculateTotalDuration'
import { whichPicture } from '../../../utils/whichPicture'
const CollectionMeta = ({data, setActiveItem }) => {

    const { collection, artists, tracks } = {...data}

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
                
                    <p onClick={ () => setActiveItem( artist ) }>
                        { artist.name }
                    </p>

                </div>  
            ))
        }
        </section>       
    )
}

export default CollectionMeta