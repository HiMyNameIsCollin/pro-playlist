import { useEffect, useState, useContext, useRef } from 'react'
import { whichPicture } from '../../../utils/whichPicture'
import { handleColorThief } from '../../../utils/handleColorThief'
import { DbHookContext } from '../Dashboard'
import { SearchHookContext } from './Search'
import { ManageHookContext } from '../manage/Manage'
import Image from 'next/image'

const ResultCard = ({ data, setActiveItem }) => {

    const [ active, setActive ] = useState(false)

    const trackImageRef = useRef()

    const { setOverlay, setQueue, setQIndex, queue, qIndex } = useContext( DbHookContext )

    
    useEffect(() => {
        if( queue[ qIndex ].id === data.id ){
            setActive( true )
        } else if( active ) setActive( false )
    },[ queue, qIndex, data ])

    const handleTrackMenu = (e, selectedTrack ) => {
        e.stopPropagation()
        if(!selectedTrack.images){
            selectedTrack.images = selectedTrack.album.images
        }
        const type = undefined
        const page = 'manage'
        const calledFrom = 'selectedTrack'
        const data = { track: selectedTrack}
        handleOverlayColors()
        setOverlay( { type, page, calledFrom, data } )
    }

    const playTrack = () => {
        setQueue( [ data ] )
        setQIndex( 0 )
    }
    

    const handleSearchSelection = () => {
        if( data.type === 'track'){
            playTrack()
        }else {
            setActiveItem( data )
        }
    }
    
    const handleOverlayColors = () => {
        const colors = handleColorThief( trackImageRef.current, 2)
        colors.map((clr, i) => document.documentElement.style.setProperty(`--selectedTrackColor${i}`, clr))
    }

    return(
        <div className={`resultCard ${data.type==='artist' && 'resultCard--artist'} ${ active && 'resultCard--active' }`} 
            onClick={ handleSearchSelection }>
            <div className='resultCard__imgContainer'>
                {
                data.images && data.images.length > 0 || data.album && data.album.images.length > 0 ?
                <img
                crossorigin='anonymous' 
                ref={ trackImageRef } 
                src={ whichPicture( data.images ? data.images : data.album.images, 'sm') } />
                :
                <Image
                loading='lazy'
                alt='Liked tracks'
                layout='fill'
                objectFit='contain'
                src='/Spotify_Icon_RGB_Green.png'/>
                }
                
            </div>
            <p className='resultCard__name'>
                { data.name }
            </p>   
            <span className='resultCard__type'> { data.type.charAt(0).toUpperCase() + data.type.slice(1) } </span>
            {
            data.type !== 'track' ?
            <i class="fas fa-chevron-right"></i> 
            :
            <i className="fas fa-ellipsis-h track__menuBtn"
                onClick={ (e) => handleTrackMenu(e, data ) }></i> 
            }
                   
        </div>
    )
}

export default ResultCard 