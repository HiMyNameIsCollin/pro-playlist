
import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useTransition, animated, useSpring } from 'react-spring'
import useApiCall from '../hooks/useApiCall'
import MenuCard from './selectOverlay/MenuCard'
import SearchForm from './search/SearchForm'
import NewPlaylistForm from './selectOverlay/NewPlaylistForm'
import { DbHookContext, DbFetchedContext } from './Dashboard'

const SelectOverlay = ({ dbDispatch, style, menuData, position, newPlaylistRef }) => {
    
    const searchInputDefault = 'Search for your playlists'
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { selectOverlay, setSelectOverlay, setMessageOverlay ,setActiveHomeItem, setActiveSearchItem} = useContext( DbHookContext )

    const [ data , setData ] = useState( [] )
    const [ searchInput, setSearchInput ] = useState( searchInputDefault )
    
    const { user_info } = useContext( DbFetchedContext )

    const lastPlaylistEditedRef = useRef( {} )


    const newPlaylistInputRef = useCallback( node => {
        if( node !== null ){
            // node.focus()
        }
    },[])

    const alterPlaylistRoute = 'v1/playlists/tracks'
    const allPlaylistsRoute = 'v1/me/playlists'

    useEffect(() => {
        if( menuData.type === 'playlists'){
            finalizeRoute( 'get', allPlaylistsRoute, null, { fetchAll: true, limit: null }, null, 'limit=50' )
        } else if( menuData.type === 'albums'){
            setData( menuData.data )
        } else if ( menuData.type === 'recPlayed'){
            setData( menuData.data )
        } else if ( menuData.type === 'newPlaylist'){
        } else if( !menuData.type ) setData([])
        
    }, [])

    useEffect(() => {
        if(apiPayload){
            if( apiPayload.method === 'get' ){
                setData( apiPayload.items )
                dbDispatch( apiPayload )
            } else if( apiPayload.method === 'post') {
                if( apiPayload.route === alterPlaylistRoute ) {
                    handleClose()
                    const playlist = { ...lastPlaylistEditedRef.current }
                    setMessageOverlay( messages => messages = [ ...messages, `${playlist.track} added to ${playlist.playlist}`])
                    lastPlaylistEditedRef.current = {} 
                }
            } else if( apiPayload.method === 'put'){
                console.log( apiPayload )
            }
        }
    },[ apiPayload ])

    useEffect(() => {
        if ( selectOverlay.length > 0 && newPlaylistRef.current.id ){
            setTimeout( handleClose, 500 )
        }
    },[ selectOverlay ])


    const handleClose = () => {
        setSelectOverlay( selectOverlay => selectOverlay = selectOverlay.slice(0, selectOverlay.length - 1) )
    }

    const handlePlaylist = ( playlist ) => {
        lastPlaylistEditedRef.current = { playlist: playlist.name, track: menuData.data[0].name }
        const args = menuData.data.map( it =>  it.uri )
        finalizeRoute('post', `${alterPlaylistRoute.slice( 0, 12 ) }/${playlist.id}/tracks`, playlist.id, null, null,  `uris=${args[0]}`, ...args )        
    }

    const spawnPlaylistMenu = () => {
        const menu = { type: 'newPlaylist' , page: menuData.page, data: menuData.data }
        setSelectOverlay( arr => arr = [ ...arr, menu ])
    }

    const shrink = useSpring({
        transform: position >= selectOverlay.length - 1 ? 'scaleX(1.00) scaleY(1.00)' : 'scaleX(0.90) scaleY(0.97)' ,
        borderRadius: position >= selectOverlay.length - 1  ? '0px' : '20px',
        minHeight: position >= selectOverlay.length - 1 ? '90vh' : '100vh'
    })

    const filterCB = (x) => {
        if(x.collaborative || x.owner.display_name === user_info.display_name){
            if( searchInput.length > 0 && searchInput !== searchInputDefault){
                if( x.name.substr(0, searchInput.length ).toLowerCase() === searchInput.toLowerCase() ){
                    return x
                }
            } else {
                return x
            }
        }
    }

    return(
        <animated.div
        style={ style }
        className='overlay'>
            
            <animated.div 
            style={ shrink }
            className={`selectOverlay `}>
                <header className='selectOverlay__header '>
                    <button className='selectOverlay__header__btn' onClick={ handleClose }> Cancel </button>
                    <p className='selectOverlay__title'>
                        {
                            menuData.type === 'playlists' ? 
                            'Add to playlist' :
                            menuData.type === 'albums' ?
                            'Releases' :
                            menuData.type === 'recPlayed' ?
                            'Recently played' :
                            menuData.type ==='newPlaylist' &&
                            'Create a playlist' 
                        }
                    </p>
                </header>
                <div className='selectOverlay__main'>
                {
                    menuData.type === 'newPlaylist' ?
                    <NewPlaylistForm menuData={ menuData }  newPlaylistRef={ newPlaylistRef } handleClose={ handleClose } />
                    :
                    <div className='selectOverlay__scroll'>
                    {
                        menuData.type === 'playlists' &&
                        <>
                        <button onClick={ spawnPlaylistMenu } className='selectOverlay__newBtn'> 
                            New playlist 
                        </button>
                        <SearchForm searchInput={ searchInput } setSearchInput={ setSearchInput }/>
                        {
                        data.filter(( x ) => filterCB(x) ).length !== 0 ?
                        data.filter(( x ) => filterCB(x) ).map(( item, i) => (
                            <MenuCard item={ item } index={ i } type={ menuData.type } handlePlaylist={ handlePlaylist } />
                        )) :
                        <p style={{ textAlign: 'center', padding: '1rem' }}> Nothing matches your query </p>
                        }
                        </>
                    }
                    {
                         
                        menuData.type === 'recPlayed' || menuData.type === 'albums' &&
                        data.map( (item, i) => <MenuCard item={ item } index={ i } allData={ data } type={ menuData.type } /> )
                    }
                    
                    </div>
                }

                </div>
            </animated.div>
                
           
        
        </animated.div>
       
    )
}

export default SelectOverlay 