import { useState, useEffect, useContext } from 'react'
import { DbFetchedContext } from '../Dashboard'

const ManageContainer = ({ activeFilter, subFilter }) => {

    const { user_info, my_albums, my_playlists, followed_artists } = useContext( DbFetchedContext )

    const [ data, setData ] = useState( [] )
    const [ sort , setSort ] = useState('')

    useEffect(() => {
        console.log(my_albums, my_playlists, followed_artists)
    },[ my_albums, my_playlists, followed_artists ])

    useEffect(() => {

    }, [activeFilter, subFilter])

    return(
        <div className='mngContainer'>

        </div>
    )
}

export default ManageContainer 