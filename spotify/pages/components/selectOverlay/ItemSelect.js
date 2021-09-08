import { useContext, useEffect, useState, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { DbHookContext, DbFetchedContext } from '../Dashboard'
import SelectOverlayHeader from './SelectOverlayHeader'
import SearchForm from '../search/SearchForm'
import MenuCard from './MenuCard'
import useApiCall from '../../hooks/useApiCall'
const ItemSelect = ({ menuData, pos }) => {
    
    const addToPlaylistRoute = 'v1/playlists/tracks'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(  )
    const { selectOverlay, setSelectOverlay, setMessageOverlay, refresh } = useContext( DbHookContext )
    const { my_playlists, user_info} = useContext( DbFetchedContext )
    const [ data, setData ] = useState( [] )
    const [ revealed, setRevealed ] = useState( 10 )
    const [ searchInput, setSearchInput ] = useState('Search')

    const alteredPlaylistRef = useRef( {} )

    useEffect(() => {
        if( menuData.type !== 'playlists'){
            setData( menuData.data)
        } else {
            setData( my_playlists )
        }
    },[])

    useEffect(() => {
        if( apiPayload ){
            refresh('my_playlists')
            const { track, playlist } = alteredPlaylistRef.current
            setMessageOverlay( m => m = [...m, `${ track } added to ${ playlist }`])
        }
    },[ apiPayload ])

    const spawnPlaylistMenu = () => {
        const menu = { type: 'newPlaylist' , page: menuData.page, data: menuData.data }
        setSelectOverlay( arr => arr = [ ...arr, menu ])
    }
    
    const filterCB = (x) => {
        if(x.collaborative || x.owner.display_name === user_info.display_name){
            if( searchInput.length > 0 && searchInput !== 'Search'){
                if( x.name.substr(0, searchInput.length ).toLowerCase() === searchInput.toLowerCase() ){
                    return x
                }
            } else {
                return x
            }
        }
    }

    const handleAddToPlaylist = ( item ) => {
        alteredPlaylistRef.current = { track: menuData.data[0].name , playlist: item.name }
        finalizeRoute('post', `${ addToPlaylistRoute.substr(0, 12) }/${ item.id }/tracks`, item.id, null, null, `uris=${ menuData.data[0].uri }`)
    }


    const handleReveal = ( e ) => {
        const scrollHeight = e.target.scrollHeight 
        if( e.target.scrollTop >= scrollHeight * .25  ) {
            const toReveal = data.length - revealed 
            setRevealed( toReveal < 10 && toReveal > 0 ? revealed + toReveal : revealed + 10 ) 
        }
    }

    const shrink = useSpring({
        transform: pos >= selectOverlay.length - 1 ? 'scaleX(1.00) scaleY(1.00)' : 'scaleX(0.90) scaleY(0.97)' ,
        borderRadius: pos >= selectOverlay.length - 1  ? '0px' : '20px',
        minHeight: pos >= selectOverlay.length - 1 ? '85vh' : '100vh'
    })

    return(
        <animated.div style={ shrink } className='selectOverlay__menu' >
            <SelectOverlayHeader menuData={ menuData }/>
            <div onScroll={ handleReveal } className='selectOverlay__main'>
                <div className='selectOverlay__scroll'>
                {
                    menuData.type === 'playlists' ?
                        <>
                        <button onClick={ spawnPlaylistMenu } className='selectOverlay__newBtn'> 
                            New playlist 
                        </button>
                        <SearchForm searchInput={ searchInput } setSearchInput={ setSearchInput }/>
                        {
                        data.filter(( x ) => filterCB(x) ).length !== 0 ?
                        data.filter(( x ) => filterCB(x) ).slice( 0, revealed ).map(( item, i) => (
                            <MenuCard item={ item } index={ i } type={ menuData.type } page={ menuData.page} handleAddToPlaylist={ handleAddToPlaylist } />
                        )) :
                        <p style={{ textAlign: 'center', padding: '1rem' }}> Nothing matches your query </p>
                        }
                        </>
                        :
                        data.slice( 0, revealed ).map( (item, i) => <MenuCard item={ item } index={ i} type={ menuData.type } page={ menuData.page} allData={ data }/>)
                }
                </div>
            </div>
        </animated.div>
    )
}

export default ItemSelect 