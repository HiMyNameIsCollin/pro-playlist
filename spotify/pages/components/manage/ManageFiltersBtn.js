import { useState, useEffect, useRef } from 'react'
import { animated, useSpring } from 'react-spring'

const ManageFiltersBtn = ({ item, activeFilter, handleFilter }) => {

    const [ btnWidth, setBtnWidth ] = useState( undefined )
    const btnRef = useRef()

    useEffect(() => {
        if( !btnWidth || btnWidth === 0){
            setBtnWidth( btnRef.current.getBoundingClientRect().width )
        }
    },[ btnWidth ])


    const { opacSwitch, peSwitch, toSwitch} = useSpring({
        to: { 
            opacSwitch: !activeFilter ? 1 : activeFilter === item ? 1 : 0 ,
            toSwitch: !activeFilter ? 'visible' : activeFilter === item ? 'visible' : 'hidden' ,
            peSwitch: !activeFilter ? 'auto' : activeFilter === item ? 'auto' : 'none'
        },
        config: {
            precision: 1
        }
    })

    const { margSwitch, paddSwitch, widthSwitch } = useSpring({
        paddSwitch: !activeFilter ? '4px 16px' : activeFilter === item ? '4px 16px' : '0px 0px' ,
        margSwitch: !activeFilter ? '0px 8px' : activeFilter === item ? '0px 8px' : '0px 0px',
        widthSwitch: !activeFilter ? btnWidth : activeFilter === item ? btnWidth : 0 ,
    })

    if( !btnWidth || btnWidth === 0 ){
        return(
            <button 
            ref={ btnRef }
            className={`manageFilters__btn`}>
            { item }
            </button>
        )
    } else {
        return(
        <animated.button 
            style={{
                margin: margSwitch.to( z => z ),
                opacity: opacSwitch.to( z => z ),
                padding: paddSwitch.to( z => z ),
                pointerEvents: peSwitch.to( z => z ) ,
                textOverflow: toSwitch.to( z => z ),
                width: widthSwitch.to( z => z )
            }}
            onClick={ () => handleFilter( item ) } 
            className={`manageFilters__btn ${ activeFilter === item && 'manageFilters__btn--active'}`}>
            { item }
        </animated.button>
        )
    }
}

export default ManageFiltersBtn