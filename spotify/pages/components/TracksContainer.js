import Track from './Track'
import { whichPicture } from '../../utils/whichPicture'
import { useState , useEffect, useContext } from 'react'
import { DbHookContext } from './Dashboard'

const TracksContainer = ({ type, data , setOverlay }) => {

    const { collection, tracks } = { ...data }
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    },[])

   

    return(
        <section className={ `trackContainer trackContainer--${type} ${mounted && 'trackContainer--active'}`}>
        {
            type === 'artist' &&
            <h4> Popular </h4> 
        }
        {
            tracks.map((track, i) => {
                if( type === 'artist' && i < 5 || type !== 'artist')
                return (
                    <Track 
                    type={ type }
                    collectionType={ collection ? collection.type : null }
                    trackIndex={ i }
                    key={ i } 
                    track={ track } 
                    data={ data }/>
                ) 
            })
        }
        </section>
    )
}

export default TracksContainer 