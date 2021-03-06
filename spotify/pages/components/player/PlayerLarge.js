import { useContext, useState, useLayoutEffect, useEffect } from 'react'
import QueueView from './QueueView'
import PlayingView from './PlayingView'
import useApiCall from '../../hooks/useApiCall'
import { PlayerHookContext } from './Player'
import { DbHookContext } from '../Dashboard'
import { animated } from 'react-spring'

const PlayerLarge = ({ style, controls }) => {

    const  { currPlaying, playerSize, setPlayerSize, } = useContext( PlayerHookContext )
    const  { setActiveHomeItem, setOverlay } = useContext( DbHookContext )
    const [ currPlayingContext, setCurrPlayingContext ] = useState( {} )
    const [ queueView, setQueueView ] = useState( false )
    
    const { finalizeRoute , apiError, apiIsPending, apiPayload  } = useApiCall(  )

    useEffect(() => {
        if( apiPayload ) setCurrPlayingContext( apiPayload )
    },[ apiPayload])

    useEffect(() => {
        if( currPlaying.context &&  currPlaying.context.href ){
            const api = 'https://api.spotify.com/'
            finalizeRoute( 'get', currPlaying.context.href.slice( api.length ), currPlaying.context.href.slice(-22) )
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

    
 

    const togglePlayer = () => {
        setPlayerSize('small')
    }

    const handleViewCollection = () => {
        togglePlayer()
        setActiveHomeItem( currPlayingContext )
    }

    const handleTrackMenu = (e ) => {
        e.stopPropagation()
        let track = { ...currPlaying }
        if( !track.images ) track.images = track.album.images
        const calledFrom = 'player'
        
        setOverlay( {type: 'player', calledFrom: calledFrom, page: null, data: { track: track }} )
    }

    

    return(
        <animated.div
        style={ style }
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
                    <p
                    className='playerLargeContainer__title'
                    onClick={ handleViewCollection }> 
                    { currPlayingContext.name } 
                    </p>
                    
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