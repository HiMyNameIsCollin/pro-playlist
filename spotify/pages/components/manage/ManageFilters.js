import { useContext } from "react";
import { useSpring, animated } from 'react-spring'
import ManageFiltersBtn from './ManageFiltersBtn'

import { ManageHookContext } from './Manage'

const ManageFilters = ({ activeFilter, setActiveFilter  }) =>  {

    const { manageState } = useContext( ManageHookContext )

    const filters = [
        'playlists', 'albums', 'artists'
    ]

    const handleFilter = ( item ) => { 
        if( !activeFilter ){
            setActiveFilter( item )
        } else {
            setActiveFilter( undefined )
        }
    }

    const { closeOpacSwitch, closeMargSwitch, closeWidthSwitch, closePaddSwitch } = useSpring({
        to:{
            closeOpacSwitch: activeFilter ? 1 : 0 ,
            closeMargSwitch: activeFilter ? '1px' : '0px',
            closeWidthSwitch: activeFilter ? '30px' : '0px',
            closePaddSwitch: activeFilter ? '8px' : '0px',
        }
    })

    const hideForOverlay = useSpring({
        opacity: manageState === 'search' ? 0 : 1
    })

    return(
        <animated.div style={ hideForOverlay } className='mngFilters'>
            <animated.button
                onClick={ () => setActiveFilter( undefined )}
                style={{
                    marginLeft: closeMargSwitch.to( z => z),
                    opacity: closeOpacSwitch.to( z => z ),
                    padding: closePaddSwitch.to( z => z),
                    width: closeWidthSwitch.to( z => z),
                }} 
                className={` mngFilters__closeBtn`}>
                <i className="fas fa-times "></i>
            </animated.button>
            {
            filters.map(( item, i) => (
                <ManageFiltersBtn item={ item } key={ i } activeFilter={ activeFilter } handleFilter={ handleFilter } />
            ))
            }
        </animated.div>
    )
}

export default ManageFilters