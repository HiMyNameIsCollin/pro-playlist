import Track from './Track'
import { whichPicture } from '../../utils/whichPicture'
import { useState , useEffect } from 'react'
const TracksContainer = ({ type, data , setOverlay }) => {

    const { collection, tracks } = { ...data }
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    },[])

    const handleTrackMenu = (e, selectedTrack ) => {
        e.stopPropagation()
        const calledFrom = type
        if(!selectedTrack.images){
            if(!selectedTrack.album){
                selectedTrack.images = collection.images
            } else{
                selectedTrack.images = selectedTrack.album.images
            }
        }
        const popupData = {
            calledFrom,
            collection, 
            tracks,
            selectedTrack,
        }
        
        setOverlay( {type: 'trackMenu', data: popupData,  func: null} )
    }

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
                    handleTrackMenu={ handleTrackMenu } 
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