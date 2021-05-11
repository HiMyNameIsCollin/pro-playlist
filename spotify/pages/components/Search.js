import { useState, useEffect } from 'react'
import BrowseContainer from './BrowseContainer'

const Search = ({ state, scrollPosition, getCategories, apiIsPending }) => {

    return(
        <div className='page page--bg'>
            <BrowseContainer 
            type='My top genres' 
            data={ state.my_top_genres.slice(0, 4) }/>
            <BrowseContainer
            type='Browse all' 
            data={ state.all_categories }
            scrollPosition={ scrollPosition }
            getCategories={ getCategories }
            apiIsPending={ apiIsPending }/>
        </div>
    )
}

export default Search