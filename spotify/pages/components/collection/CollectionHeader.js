import { useSpring, animated } from 'react-spring'
import { useLayoutEffect, useEffect, useState, useRef } from 'react'
import { whichPicture } from '../../../utils/whichPicture'
import { handleViewArtist } from '../../../utils/handleViewArtist'
import { capital } from '../../../utils/capital'


const CollectionHeader = ({ data , setOverlay, setActiveItem, headerMounted, setHeaderMounted , scrollPosition}) => {
    const { collection, artists, tracks } = { ...data }
    const [ elementHeight, setElementHeight ] = useState(null)
    
    const elementPercentRef = useRef(elementHeight)

    useLayoutEffect(() => {
        const thisHeader = document.querySelector('.collectionHeader')
        document.documentElement.style.setProperty('--fixedHeaderPadding', thisHeader.offsetHeight + 'px')
        setElementHeight(thisHeader.offsetHeight)
    }, [])

    useEffect(() => {
        // WILL NEED TO MAKE A RESIZING HOOK AND MAKE THIS IT A DEPENDENCY OF THIS UE
        if( elementHeight ){
            const totalHeight = document.documentElement.scrollHeight
            const percentOfTotal = ( elementHeight / totalHeight ) * 100 
            elementPercentRef.current = percentOfTotal
        }
    },[ elementHeight ])

    return(
        <header className={`collectionHeader ${headerMounted ? 'collectionHeader--active' : ''}`}>
            <div className='collectionHeader__imgContainer'>
                <img onLoad={() => setHeaderMounted(true)} src={ whichPicture(collection.images, 'med') } />
            </div> 
            <h1> { collection.name } </h1>
            
            <div className='collectionHeader__artists'>
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
            <div className='collectionHeader__info'>
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