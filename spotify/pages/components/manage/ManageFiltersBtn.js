import { useState, useEffect, useCallback, useContext } from 'react'
import { animated, useSpring } from 'react-spring'
import { DbHookContext } from '../Dashboard'

const ManageFiltersBtn = ({ item, activeFilter, handleFilter }) => {

    const [ mounted, setMounted ] = useState( false )
    const [ btnWidth, setBtnWidth ] = useState( undefined )

    const { dashboardState } = useContext( DbHookContext )

    const btnRef = useCallback( node => {

        if( node ){
            const ro = new ResizeObserver( entries => {
                if( node.getBoundingClientRect().width > 0 ) {
                    setBtnWidth( node.getBoundingClientRect().width )
                    setMounted( true )
                }
            })
            ro.observe( node )
            return () => ro.disconnect()
        }

    },[ dashboardState ])


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
        config: {
            precision: !mounted ? 1 : 0 
        },
        onRest: () => !mounted && setMounted( true ) 
    })

    if( !mounted ){
        return(
            <button 
            ref={ btnRef }
            className={`mngFilters__btn`}>
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
            className={`mngFilters__btn ${ activeFilter === item && 'mngFilters__btn--active'}`}>
            { item.charAt(0).toUpperCase() + item.slice(1) }
        </animated.button>
        )
    }
}

export default ManageFiltersBtn