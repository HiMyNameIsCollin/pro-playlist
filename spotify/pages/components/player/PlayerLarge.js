import { useContext, useState, useLayoutEffect, useEffect } from 'react'
import QueueView from './QueueView'
import PlayingView from './PlayingView'
import useApiCall from '../../hooks/useApiCall'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import { useSpring, animated } from 'react-spring'

const PlayerLarge = ({ controls }) => {

    const  { currPlaying, playerSize, setPlayerSize, } = useContext( PlayerHookContext )
    const  { setActiveHomeItem, setOverlay } = useContext( DbHookContext )
    const [ currPlayingContext, setCurrPlayingContext ] = useState( {} )
    const [ queueView, setQueueView ] = useState( false )
    const API = 'https://api.spotify.com/'
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(API)

    useEffect(() => {
        if( apiPayload ) setCurrPlayingContext( apiPayload )
    },[ apiPayload])

    useEffect(() => {
        if( currPlaying.context &&  currPlaying.context.href ){
            finalizeRoute( 'get', currPlaying.context.href.slice(API.length), currPlaying.context.href.slice(-22) )
        } else {
            // For search 
            const context = {
                name: 'Search',
                href: currPlaying.album.href,
                type: 'search'
            }
            const currPlayingClone = { ...currPlaying.album }
            currPlayingClone['context'] = context
            setCurrPlayingContext( currPlayingClone )
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
        setActiveHomeItem( currPlayingContext )
    }

    const handleTrackMenu = (e, selectedTrack ) => {
        e.stopPropagation()
        const calledFrom = 'player'
        const pageType = null
        if(!selectedTrack.images){
            if(!selectedTrack.album){
                selectedTrack.images = collection.images
            } else{
                selectedTrack.images = selectedTrack.album.images
            }
        }
        setOverlay( {type: calledFrom, pageType: pageType, track: selectedTrack} )
    }


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
                    <h4
                    onClick={ handleViewCollection }> 
                    { currPlayingContext.name } 
                    </h4>
                    
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