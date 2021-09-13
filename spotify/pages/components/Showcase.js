import { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { animated } from 'react-spring'
import BrowseContainer from './BrowseContainer'
import  useApiCall  from '../hooks/useApiCall'
import { DbHookContext } from './Dashboard'
import { SearchPageSettingsContext } from './search/Search'

const routes = {
    all_categories: 'v1/browse/categories',
    search: 'v1/search',
}
const Showcase = ({ style, data }) => {

    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall()
    const [ categoryResults, setCategoryResults ] = useState( [] )
    const { setTransMinHeight, transitionComplete, setTransitionComplete, } = useContext( SearchPageSettingsContext )

    const thisComponentRef = useRef() 

    const thisComponent = useCallback(node => {
        if (node !== null) {
            const ro = new ResizeObserver( entries => {
                if( node.offsetHeight > 0 ) setTransMinHeight( node.offsetHeight )
            })
            ro.observe( node )
            thisComponentRef.current = node
            
            return () => ro.disconnect()
        }
      }, [])

    useEffect(() => {
        if( transitionComplete ) {
            thisComponentRef.current.classList.add('fadeIn')
            setTransitionComplete(false)
            thisComponentRef.current.style.minHeight = '100vh'
        }
    }, [ transitionComplete ])

    useEffect(() => {
        if( data.id ){
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
        style={ style }
        ref={ thisComponent } 
        className='page page--search showcase'>
            <p className='showcase__title'> { data.name }</p>
        {
        categoryResults.map(( cat, i ) => {
            if( cat.playlists.length > 0 ){
                return(
                    <BrowseContainer
                    key={ i }
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