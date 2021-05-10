import { useState, useEffect } from 'react'
import BrowseContainer from './BrowseContainer'

const Search = ({ state }) => {

    return(
        <div className='page page--bg'>
            <BrowseContainer type='My top genres' data={ state.my_top_genres.slice(0, 4) }/>
            <BrowseContainer type='Browse all' data={ state.all_categories }/>
        </div>
    )
}

export default Search