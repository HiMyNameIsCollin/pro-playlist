import { useState, useEffect, useContext } from 'react'
import BrowseContainer from './BrowseContainer'
import { finalizeRoute } from '../../utils/finalizeRoute'
import  useApiCall  from '../hooks/useApiCall'
import { DbHookContext } from './Dashboard'

const routes = {
    all_categories: 'v1/browse/categories', // id/playlists
    search: 'v1/search',
}
const Showcase = ({ data }) => {

    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const { activeSearchItem, setActiveSearchItem } = useContext( DbHookContext)
    const [ categoryResults, setCategoryResults ] = useState( [] )

    useEffect(() => {
        if( data.type === 'category'){
            finalizeRoute('get', `${ routes.all_categories }/${data.id}/playlists`, fetchApi, data.id )
        }
        
    },[])

    const sortPlaylists = ( items ) => {
        let arr = []
        
        items.forEach((playlist, i) => {
            const index = arr.findIndex( x => x.owner === playlist.owner.display_name )
            if(index !== -1){
                arr[ index ].playlists = [...arr[ index ].playlists, playlist]
            } else {
                arr.push({
                    owner: playlist.owner.display_name,
                    playlists: [ playlist ]
                })
            }
        })
        console.log(arr)
        return arr
    }

    const curatePlaylists = ( playlists ) => {
        let spotify = []
        let charts = []
        let users = []
        playlists.forEach(( p, i ) => {
            if( p.owner.toLowerCase() === 'spotify'){
                spotify = [ ...spotify, ...p.playlists ]
            } else if ( p.owner.toLowerCase() === 'spotifycharts' ){
                charts = [ ...charts, ...p.playlists ]
            } else {
                users = [ ...users, ...p.playlists]
            }
        })
        const curated = [
                { message: 'Curated by Spotify', playlists: spotify },
                { message: 'Spotify charts', playlists: charts },
                { message: 'User curated playlists', playlists: users }
            ]
        return curated
    }

    useEffect(() => {
        if( apiPayload ){
            if( data.type === 'category'){
                const playlists = sortPlaylists( apiPayload.playlists.items )
                const curatedPlaylists = curatePlaylists( playlists )
                setCategoryResults( curatedPlaylists )
            }
        }
    },[ apiPayload ])

    return(
        <div className='page page--search'>
        {
        categoryResults.map(( cat, i ) => {
            if( cat.playlists.length > 0 ){
                return(
                    <BrowseContainer
                    type='BcShowcase'
                    message={ cat.message }
                    data={ cat.playlists }
                    />
                )
            }
            
        })
        }
        </div>
    )
}

export default Showcase