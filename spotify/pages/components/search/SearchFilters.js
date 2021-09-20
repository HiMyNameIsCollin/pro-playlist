import { useState, useEffect, useRef } from 'react'

const FilterBtn = ({ name, activeFilter, setActiveFilter}) => {

    const [ activeBtn, setActiveBtn ] = useState( false )

    useEffect(() => {
        if( activeFilter === name){
            setActiveBtn( true )
        } else if ( activeBtn && activeFilter !== name){
            setActiveBtn(false)
        }
    }, [ activeFilter ])

    return(
        <button
        onClick={ () => setActiveFilter( name )}
        className={`searchFilters__btn ${ activeBtn && 'searchFilters__btn--active' } `} >
            { name }
        </button>
    )
}

const SearchFilters = ({ activeFilter, setActiveFilter }) => {

    const filters = [
        'Top', 'Artists', 'Albums', 'Tracks', 'Playlists', 
    ]
    return(
        <div className='searchFilters'>
        {
            filters.map((f, i) => <FilterBtn key={ i } name={ f } activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/> )
        }
        </div>
    )
}
export default SearchFilters