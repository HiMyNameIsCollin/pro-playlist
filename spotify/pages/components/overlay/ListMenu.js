import { useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'

const ListMenu = ({ setActiveItem, transition, calledFrom, page, artists }) => {

    const { setOverlay } = useContext( DbHookContext )

    const handleViewArtist = ( e, artist) => {
        e.preventDefault()
        setOverlay( {} )
        setTimeout(() => setActiveItem( artist ) , 250 )
    }


    return(
        <animated.div
        style={ transition } 
        className='overlay__popup listMenu'>
        <p className='trackMenu__title'> Select an artist </p>
        {
            artists.map( (a, i) => {
                return <button onClick={ (e) => handleViewArtist( e, a )  }> <span> { a.name } </span> <i class="fas fa-arrow-right"></i></button>
            })
        }
        </animated.div>
    )
}

export default ListMenu