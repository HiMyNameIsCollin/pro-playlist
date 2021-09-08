import { animated, useTransition } from 'react-spring'

const ManageOverlay = ({ data, setData, sortFilters, setSort, style }) => {
    
    const closeOverlay = ( e ) => {
        e.stopPropagation()
        setData( {} )
    }

    const slideUpTrans = useTransition( data, {
        from: { transform: 'translateY(100%)' },
        enter:{ transform: 'translateY(0%)' } ,
        leave: { transform: 'translateY(100%)'}
    })
    

    return(
        <animated.div
        style={ style }
        onClick={ closeOverlay }
        className='mngOverlay'>
            {
                slideUpTrans((props, item) => (
                    item.type &&
                    <animated.div
                    style={ props }
                    className='sortMenu'>
                        <p className='sortMenu__title'>
                            { data.type }
                        </p>
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