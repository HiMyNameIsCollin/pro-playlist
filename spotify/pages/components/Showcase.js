import { useState, useEffect } from 'react'
import BrowseContainer from './BrowseContainer'
import { finalizeRoute } from '../../utils/finalizeRoute'
import  useApiCall  from '../hooks/useApiCall'

const routes = {
    all_categories: 'v1/browse/categories', // id/playlists
    search: 'v1/search',
}
const Showcase = ({ data }) => {
    return(
        <div className='page page--search'>
            Test
        </div>
    )
}

export default Showcase