import { animated } from 'react-spring'

const ManageOverlay = ({ data, setData, sortFilters, setSort, style }) => {
    
    const closeOverlay = ( e ) => {
        e.stopPropagation()
        setData({ type: undefined })
    }

    return(
        <animated.div
        style={ style }
        onClick={ closeOverlay }
        className='mngOverlay'>

            <div
            className='sortMenu'>
                <h5>
                    { data.type }
                </h5>
                {
                    sortFilters.map( f => {
                        return <button onClick={ ()=> setSort(f)} className='sortMenu__filterBtn'> { f } </button>
                    })
                }
                <button onClick={ closeOverlay } className='sortMenu__cancelBtn'> Cancel </button>
            </div>

        
        </animated.div>
    )
}

export default ManageOverlay