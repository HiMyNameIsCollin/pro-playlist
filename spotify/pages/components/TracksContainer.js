import Track from './Track'
import { whichPicture } from '../../utils/whichPicture'
import { useState , useEffect, useContext } from 'react'
import { DbHookContext } from './Dashboard'

const TracksContainer = ({ type, data }) => {

    const { collection, tracks } = { ...data }
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    },[])

   

    return(
        <section className={ `trackContainer trackContainer--${type} `}>
        {
            type === 'artist' &&
            <p className='trackContainer__title'> Popular </p> 
        }
        {
            tracks.map((track, i) => {
                if(( type === 'artist' && i < 5 || type !== 'artist' ) && 
                ( track.track || track.artists ) )
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