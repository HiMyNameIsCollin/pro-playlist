import Track from './Track'
import { whichPicture } from '../../utils/whichPicture'
import { useState , useEffect } from 'react'
const TracksContainer = ({ type, data , setOverlay }) => {

    const { collection, tracks } = { ...data }
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    },[])

    const handleTrackMenu = ( selectedTrack ) => {
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
        <section className={ `${type}__trackContainer trackContainer ${mounted && 'trackContainer--active'}`}>
        {
            type === 'artist' &&
            <h4> Popular </h4> 
        }
        {
            tracks.map((track, i) => {
                return (
                    <Track 
                    type={ type }
                    i={ i }
                    handleTrackMenu={ handleTrackMenu } 
                    key={ i } 
                    track={ track.track ? track.track : track } 
                    data={ data }/>
                ) 
            })
        }
        </section>
    )
}

export default TracksContainer 