import { calculateTotalDuration } from '../../../utils/calculateTotalDuration'

const CollectionMeta = ({ data }) => {

    const { collection, main_artist, tracks } = {...data}
    return(
        <section className='collection__meta'>
            <p>
                { collection.release_date }
            </p>
            <span>
                {tracks.length} { tracks.length === 1 ? 'track' : 'tracks' }
            </span>
            || 
            <span>
                { calculateTotalDuration(tracks) }
            </span>
        </section>       
    )
}

export default CollectionMeta