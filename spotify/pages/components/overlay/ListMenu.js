import { useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'

const ListMenu = ({ setActiveSearchItem, transition, pageType,  artists }) => {

    const { setActiveHomeItem } = useContext( DbHookContext )

    const handleViewArtist = ( e, artist) => {
        e.preventDefault()
        if( pageType === 'search' ) setActiveSearchItem( artist )
        if( pageType === 'home' || pageType === 'player' ) setActiveHomeItem( artist )
    }


    return(
        <animated.div
        style={ transition } 
        className='overlay__popup listMenu'>
        <h3> Select an artist </h3>
        {
            artists.map( (a, i) => {
                return <button onClick={ (e) => handleViewArtist( e, a )  }> <span> { a.name } </span> <i class="fas fa-arrow-right"></i></button>
            })
        }
        </animated.div>
    )
}

export default ListMenu