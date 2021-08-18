
import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useTransition, animated, useSpring } from 'react-spring'
import useApiCall from '../hooks/useApiCall'
import MenuCard from './selectOverlay/MenuCard'
import { DbHookContext, DbFetchedContext } from './Dashboard'

const SelectOverlay = ({ dbDispatch, style, menuData, position, newPlaylistRef }) => {
    
    const API = 'https://api.spotify.com/'
    const [ input, setInput ] = useState('')
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall( API )
    const { selectOverlay, setSelectOverlay, setMessageOverlay ,setActiveHomeItem, setActiveSearchItem} = useContext( DbHookContext )

    const { user_info } = useContext( DbFetchedContext )
    const [ data , setData ] = useState( [] )

    const currPageRef = useRef()
    const setActiveItem = useRef()

    const newPlaylistInputRef = useCallback( node => {
        if( node !== null ){
            // node.focus()
        }
    },[])

    const alterPlaylistRoute = 'v1/playlists/tracks'
    const allPlaylistsRoute = 'v1/me/playlists'
    const newPlaylistRoute = `v1/users/${user_info.id}/playlists`

    useEffect(() => {
        currPageRef.current = menuData.page
        menuData.page
    },[])

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
                if( apiPayload.route === newPlaylistRoute ){
                    finalizeRoute('post', `${ alterPlaylistRoute.slice( 0, 12 ) }/${apiPayload.id}/tracks`, apiPayload.id, null, null,  `uris=${selectOverlay[0].data[0].uri}` )
                    console.log(apiPayload)
                    newPlaylistRef.current = apiPayload
                }
                if( apiPayload.route === alterPlaylistRoute ) {
                    handleClose()
                }
                // const modified = data.find( x => x.id === apiPayload.id )
                // setMessageOverlay({ message: `Added to ${ modified.name }`, active: true })
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
        const args = menuData.map( it =>  it.uri )
        finalizeRoute('post', `${alterPlaylistRoute.slice( 0, 12 ) }/${playlist.id}/tracks`, playlist.id, null, null,  `uris=${args[0]}`, ...args )
    }


    const spawnPlaylistMenu = () => {
        const menu = { type: 'newPlaylist' , page: menuData.page, data: menuData.data }
        setSelectOverlay( arr => arr = [ ...arr, menu ])
    }

    const handleCreatePlaylist = (e) => {
        e.preventDefault()
        const body = {
            "name": input !== '' ? input :  selectOverlay[0].data[0].name,
            "description": "Description for playlist",
            "public": true
        }
        finalizeRoute('post', newPlaylistRoute, null, null, body )
    }

    const shrink = useSpring({
        transform: position >= selectOverlay.length - 1 ? 'scaleX(1.00) scaleY(1.00)' : 'scaleX(0.90) scaleY(0.97)' ,
        borderRadius: position >= selectOverlay.length - 1  ? '0px' : '20px',
        minHeight: position >= selectOverlay.length - 1 ? '90vh' : '100vh'
    })

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
                    <form onSubmit={ handleCreatePlaylist } className='selectOverlay__newPlaylistForm'>
                        <label forHtml='newPlaylistInput'> Give your playlist a name. </label>
                        <input 
                        onClick={ (e) => {
                            e.target.select()
                            e.target.focus()
                        }}
                        ref={ newPlaylistInputRef }
                        onChange={ (e) => setInput( e.value )} 
                        type='text' 
                        name='newPlaylistInput' 
                        value={ input !== '' ? input : `${ menuData.data[0].name }` }/>
                        <button onSubmit={ handleCreatePlaylist } className='selectOverlay__newBtn'> 
                            Create 
                        </button>
                    </form> :
                    <div className='selectOverlay__scroll'>
                    {
                        menuData.type === 'playlists' &&
                        <>
                        <button onClick={ spawnPlaylistMenu } className='selectOverlay__newBtn'> 
                            New playlist 
                        </button>
                        <form className='selectOverlay__form searchOverlay__form'>
                            <i className="fas fa-search"></i>
                            <input type='text' placeholder='Search playlists'/>
                        </form>
                        </>
                    }
                    {
                        menuData.type === 'playlists' ? 
                        data.slice().filter( x => x.collaborative || x.owner.display_name === user_info.display_name).map(( item, i) => (
                            <MenuCard item={ item } index={ i } type={ menuData.type } handlePlaylist={ handlePlaylist } />
                        )) 
                        :
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