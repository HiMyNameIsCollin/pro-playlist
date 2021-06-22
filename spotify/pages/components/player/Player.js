import PlayerCollapsed from './PlayerCollapsed'
import PlayerLarge from './PlayerLarge'
import { finalizeRoute } from '../../../utils/finalizeRoute'
import { useState, useEffect,  useLayoutEffect, useContext, useRef, createContext} from 'react'
import { DbHookContext } from '../Dashboard'
import  useApiCall  from '../../hooks/useApiCall'

export const PlayerHookContext = createContext()

const Player = ({ hiddenUI }) => {
    const API = 'https://api.spotify.com/'
    const { queue , setQueue, audioRef, prevTracksRef, qIndex, setQIndex } = useContext( DbHookContext )

    const [ playerSize, setPlayerSize ] = useState( 'small' )
    const [ currPlaying, setCurrPlaying ] = useState( {} )
    const [ trackProgress, setTrackProgress ] = useState( 0 );
    const [ isPlaying, setIsPlaying ] = useState( false )
    const [ repeat, setRepeat ] = useState( 'none' )
    const [ shuffle, setShuffle ] = useState( false )
    const trackProgressIntervalRef = useRef()
    const queuedTrackContextRef = useRef([])
    const unShuffledQueueRef = useRef({ index: '', arr: [] })
    const playerHookState ={
        currPlaying,
        setCurrPlaying,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
        trackProgressIntervalRef,
        playerSize,
        setPlayerSize,
        repeat,
        setRepeat,
        shuffle,
        setShuffle,
        
    }

    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const getTrack_route = 'v1/tracks'

    
    
// Tracks the progress of the currently playing track. 
// Interval is cleared in the track component when un-mounting, or in this component at track end. 
    const startTimer = () => {
        if( trackProgressIntervalRef.current ) clearInterval( trackProgressIntervalRef.current )
        trackProgressIntervalRef.current = setInterval(() => {
            if(audioRef.current.ended){
                setTrackProgress(0)
                setIsPlaying( false )
                handleQueue()
            }else {
                setTrackProgress( Math.round( audioRef.current.currentTime ) )
            }
        },1000)
    }

// If first track in Queue changes, grabs the full track info of the new first element in Queue array.
    useEffect(() => {

        if( queue[ qIndex ] && queue[ qIndex ].id !== currPlaying.id ){
            getTrack( queue[ qIndex ] )
        } else if ( queue[ qIndex ] && queue[ qIndex ].id === currPlaying.id ){
            const obj = { ...currPlaying}
            setCurrPlaying( obj )
        }
    },[ qIndex ])

    const getTrack = ( track ) => {
        if( track.album ) {
            setCurrPlaying( track )
        } else {
            queuedTrackContextRef.current.push(track.context)
            const id = track.id
            finalizeRoute('get', `${ getTrack_route }/${id}`, fetchApi, id)
        }
    }

// Tosses received track from the fetch into the player.
    useEffect(() => {
        if(apiPayload){
            apiPayload['context'] = queuedTrackContextRef.current.shift()
            setCurrPlaying( apiPayload )
        }
    }, [ apiPayload ])


// Simple play/pause control via state.
    useEffect(() => {
        if( isPlaying ){
            audioRef.current.play()
            startTimer()
        } else {
            audioRef.current.pause()
            clearInterval(trackProgressIntervalRef.current)
        }
    }, [ isPlaying ])

    useEffect(() => {
        
        if( shuffle ){
            const OGQ = queue.slice( qIndex + 1 )
            unShuffledQueueRef.current = { index: qIndex, arr: [ ...OGQ ]}
            const shuffled = OGQ.sort( () => Math.random() - 0.5 )
            setQueue( queue => queue = [ ...queue.slice( 0, qIndex + 1 ), ...shuffled ] )

        } else {
            if( unShuffledQueueRef.current.arr.length > 0 ){
                const { index, arr } = unShuffledQueueRef.current
                setQueue( queue => queue = [ ...queue.slice( 0, qIndex  ), queue[ qIndex ], ...arr  ] )
                unShuffledQueueRef.current = { index: '', arr: [] }
            }

        }
    }, [ shuffle ])

    const handleQueue = () => {
        if( repeat === 'none' ){
            if( qIndex !== queue.length){
                setQIndex( qIndex => qIndex = qIndex + 1 )
            } else {
                setTrackProgress( 0 )
                setQIndex( 0 )
            }
        } else if ( repeat === 'one'){
            let clone = { ...currPlaying }
            setCurrPlaying( clone )
        } else if ( repeat === 'all' ){
            if( qIndex === queue.length - 1 ){
                setQIndex( 0 )
                setTrackProgress( 0 )

            } else {
                setQIndex( qIndex => qIndex = qIndex + 1 )
            }
        }
    }

    const playTrack = () => {
        setIsPlaying( true )
    }

    const pauseTrack = () => {
        setIsPlaying( false )
    }

    const nextTrack = () => {
        if( isPlaying ) setIsPlaying( false )
        handleQueue()
    }

    const prevTrack = () => {
        if( isPlaying ) setIsPlaying( false )
        if( qIndex > 0 ){
            setQIndex( qIndex => qIndex = qIndex - 1 )
        }else {
            audioRef.current.currentTime = 0
            audioRef.current.pause()
            setTrackProgress( 0 )
            
        }
    }

    const handleRepeat = () => {
        const repeatTypes = [ 'none', 'one', 'all' ]
        if( repeat === repeatTypes[0] ) setRepeat( repeatTypes[1] )
        if( repeat === repeatTypes[1] ) setRepeat( repeatTypes[2] )
        if( repeat === repeatTypes[2] ) setRepeat( repeatTypes[0] )
    }

    const controls = {
        playTrack,
        pauseTrack,
        nextTrack,
        prevTrack,
        handleRepeat
    }

    return(
        <>
            <PlayerHookContext.Provider value={ playerHookState }>
                {
                currPlaying.id && <PlayerLarge controls={ controls }/>
                }
                <PlayerCollapsed hiddenUI={ hiddenUI } />
            </PlayerHookContext.Provider>
            
        </>
        
    )
}

export default Player