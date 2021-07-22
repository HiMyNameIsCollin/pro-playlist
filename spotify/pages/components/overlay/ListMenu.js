import { useContext } from 'react'
import { animated } from 'react-spring'
import { DbHookContext } from '../Dashboard'

const ListMenu = ({ setActiveItem, transition, calledFrom, page, artists }) => {


    const handleViewArtist = ( e, artist) => {
    e.preventDefault()
       setActiveItem( artist )
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