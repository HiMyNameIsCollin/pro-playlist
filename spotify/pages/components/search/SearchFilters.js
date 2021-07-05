import { useState, useEffect, useRef } from 'react'

const FilterBtn = ({ name, activeFilter, setActiveFilter}) => {

    const [ activeBtn, setActiveBtn ] = useState( false )

    useEffect(() => {
        if( activeFilter === name.toLowerCase()){
            setActiveBtn( true )
        } else if ( activeBtn && activeFilter !== name.toLowerCase()){
            setActiveBtn(false)
        }
    }, [ activeFilter ])

    return(
        <button
        onClick={ () => setActiveFilter( name.toLowerCase() )}
        className={`searchFilters__btn ${ activeBtn && 'searchFilters__btn--active' } `} >
            { name }
        </button>
    )
}

const SearchFilters = ({ activeFilter, setActiveFilter }) => {

    const filters = [
        'Top', 'Artists', 'Albums', 'Tracks', 'Playlists', 'Genres & Moods'
    ]

    return(
        <div className='searchFilters'>
        {
            filters.map((f, i) => <FilterBtn name={ f } activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/> )
        }
        </div>
    )
}
export default SearchFilters