import { useState, useEffect } from 'react'
import BrowseContainer from './BrowseContainer'

const Search = ({ state, scrollPosition, getCategories, apiIsPending, setActive }) => {

    return(
        <div className='page page--bg'>
            <BrowseContainer 
            message='My top genres' 
            data={ state.my_top_genres.slice(0, 4) }
            setActive={ setActive } />
            <BrowseContainer
            message='Browse all' 
            data={ state.all_categories }
            scrollPosition={ scrollPosition }
            getCategories={ getCategories }
            apiIsPending={ apiIsPending }
            setActive={ setActive } />
        </div>
    )
}

export default Search