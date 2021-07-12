import { useState, useEffect, useContext } from 'react'
import { animated } from 'react-spring'
import BrowseContainer from './BrowseContainer'
import  useApiCall  from '../hooks/useApiCall'
import { DbHookContext } from './Dashboard'

const routes = {
    all_categories: 'v1/browse/categories', // id/playlists
    search: 'v1/search',
}
const Showcase = ({ transition, currPageRef, data }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const { activeSearchItem, setActiveSearchItem } = useContext( DbHookContext)
    const [ categoryResults, setCategoryResults ] = useState( [] )

    useEffect(() => {
        if( data.type === 'category'){
            finalizeRoute('get', `${ routes.all_categories }/${data.id}/playlists`, data.id )
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
        <animated.div
        style={ transition }
        ref={ currPageRef } 
        className='page page--search showcase'>
            <h2 className='showcase__title'> { data.name }</h2>
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
        </animated.div>
    )
}

export default Showcase