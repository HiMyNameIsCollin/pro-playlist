import { useEffect, useState,  } from "react";
import { useSpring, animated } from 'react-spring'
import ManageFiltersBtn from './ManageFiltersBtn'

const ManageFilters = ({ activeFilter, setActiveFilter, subFilter, setSubFilter }) =>  {

    const [ showSubFilter, setShowSubFilter ] = useState( false )

    // useEffect(() => {
    //     if(activeFilter === 'albums' || activeFilter === 'playlists'){
    //         setShowSubFilter( true )
    //     }else {
    //         setShowSubFilter( false )
    //     }
    // },[ activeFilter ])

    useEffect(() => {
        if( activeFilter === undefined && subFilter ) setSubFilter( false )
    },[])

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

    // const { trSwitch, paddSwitch, zSwitch } = useSpring({
    //     to:{
    //         trSwitch: subFilter ? '-30' : '0',
    //         paddSwitch: subFilter ? '32px': '16px',
    //         zSwitch: subFilter ? 0 : 1
    //     }
    // })

    return(
        <div className='mngFilters'>
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
            {/* {
                showSubFilter &&
                <animated.button 
                onClick={ () => setSubFilter(!subFilter)}
                style={{ 
                    margin: 0,
                    paddingLeft: paddSwitch.to( z => z ),
                    transform: trSwitch.to( z => `translateX(${z}%)`) ,
                    zIndex: zSwitch.to( z => z )
                }}
                className={`manageFilters__btn ${ subFilter && 'manageFilters__btn--active'}`}>
                Downloaded
                </animated.button>
            } */}
        
        </div>
    )
}

export default ManageFilters