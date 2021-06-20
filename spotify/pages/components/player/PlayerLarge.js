import { useContext, useState, useLayoutEffect, useEffect } from 'react'
import QueueView from './QueueView'
import PlayingView from './PlayingView'
import useApiCall from '../../hooks/useApiCall'
import { finalizeRoute } from '../../../utils/finalizeRoute'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import { useSpring, animated } from 'react-spring'

const PlayerLarge = ({ controls }) => {

    const  { currPlaying, playerSize, setPlayerSize, } = useContext( PlayerHookContext )
    const  { setActiveItem, setOverlay } = useContext( DbHookContext )
    const [ currPlayingContext, setCurrPlayingContext ] = useState( {} )
    const [ queueView, setQueueView ] = useState( false )
    const API = 'https://api.spotify.com/'
    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)

    useEffect(() => {
        if( apiPayload ) setCurrPlayingContext( apiPayload )
    },[ apiPayload])

    useEffect(() => {
        if( currPlaying.context.href ){
            finalizeRoute( 'get', currPlaying.context.href.slice(API.length), fetchApi, currPlaying.context.href.slice(-22) )
        } else {
            // For search 
            setCurrPlayingContext({ name: currPlaying.context.name })
        }
    }, [ currPlaying ])

    
    const largePlayerAnimation = useSpring({
        transform: playerSize === 'large' ? 'translateY(0%)' : 'translateY(100%)'
    })

    const togglePlayer = () => {
        setPlayerSize('small')
    }

    const handleViewCollection = () => {
        togglePlayer()
        setActiveItem( currPlayingContext )
    }

    const handleTrackMenu = ( e ) => {
        e.stopPropagation()
        let selectedTrack = { ...currPlaying }
        if(!selectedTrack.images){
            if(!selectedTrack.album){
                selectedTrack.images = collection.images
            } else{
                selectedTrack.images = selectedTrack.album.images
            }
        }
        const popupData = {
            collection: currPlayingContext, 
            tracks: null,
            selectedTrack: selectedTrack,
        }
        setOverlay( {type: 'trackMenuPlayer', data: popupData,  func: null , func2: togglePlayer} )
    }

    useLayoutEffect(() => {
        const body = document.querySelector('body')
        if( playerSize === 'large' ) {
            body.classList.add('noScroll')
        } else{
            body.classList.remove('noScroll')
        }
    }, [ playerSize ])
    


    return(
        <animated.div
        style={ largePlayerAnimation }
        className='playerLargeContainer'>
            <div className={ `playerLargeContainer__wrapper ${ queueView && 'playerLargeContainer__wrapper--qv'}` }>
                <div className={`playerLargeContainer__header ${queueView && 'playerLargeContainer__header--qv'} ` }>
                    {
                        queueView ?
                        <i
                        onClick={ () => setQueueView( false )} 
                        className="fas fa-chevron-left"></i> :
                        <i
                        onClick={ togglePlayer }  
                        className="fas fa-chevron-down"></i>
                    }
                    <h3 
                    onClick={ handleViewCollection }> 
                    { currPlayingContext.name } 
                    </h3>
                    
                    <i
                    onClick={ handleTrackMenu } 
                    className={ `fas fa-ellipsis-h ${queueView && 'noShow'}` }></i>
                </div>

                {
                    !queueView ?
                    <PlayingView controls={ controls } queueView={ queueView } setQueueView={ setQueueView } />
                    :
                    <QueueView handleTrackMenu={ handleTrackMenu } controls={ controls } queueView={ queueView } setQueueView={ setQueueView }/>
                }
            </div>

            
        </animated.div>
    )
}

export default PlayerLarge