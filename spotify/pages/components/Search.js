import { useState, useEffect } from 'react'
import BrowseContainer from './BrowseContainer'

const Search = ({ state, scrollPosition, getCategories, apiIsPending, Link }) => {

    return(
        <div className='page page--bg'>
            <BrowseContainer 
            message='My top genres' 
            data={ state.my_top_genres.slice(0, 4) }
            Link={ Link } />
            <BrowseContainer
            message='Browse all' 
            data={ state.all_categories }
            scrollPosition={ scrollPosition }
            getCategories={ getCategories }
            apiIsPending={ apiIsPending }
            Link={ Link } />
        </div>
    )
}

export default Search