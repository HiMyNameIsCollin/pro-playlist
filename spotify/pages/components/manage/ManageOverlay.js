import { useTransition, useSpring, animated } from 'react-spring'


const ManageOverlay = ({ data, setData, sortFilters, setSort }) => {
    
    const trans = useTransition(data, {
        from: { transform: 'translate3d( 0, 100%, 0)' },
        enter: { transform: 'translate3d( 0, 0%, 0)' },
        leave: { transform: 'translate3d( 0, 100%, 0)' },
    })

    const fadeIn = useSpring({
        opacity: data.type ? 1 : 0,
        pointerEvents: data.type ? 'auto' : 'none'
    })

    const closeOverlay = ( e ) => {
        e.stopPropagation()
        setData({ type: undefined })
    }

    return(
        <animated.div
        style={ fadeIn } 
        onClick={ closeOverlay }
        className='mngOverlay'>
        {
        trans(( props, item ) => (
            item.type &&
            <animated.div 
            style={ props }
            className='sortMenu'>
                <h5>
                    { item.type }
                </h5>
                {
                    sortFilters.map( f => {
                        return <button onClick={ ()=> setSort(f)} className='sortMenu__filterBtn'> { f } </button>
                    })
                }
                <button onClick={ closeOverlay } className='sortMenu__cancelBtn'> Cancel </button>
            </animated.div>
        ))
        }
        
        </animated.div>
    )
}

export default ManageOverlay