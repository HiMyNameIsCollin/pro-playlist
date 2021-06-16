import PlayerCollapsed from './PlayerCollapsed'
import PlayerLarge from './PlayerLarge'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { useState, useEffect, useContext, useRef, createContext} from 'react'
import { DbHookContext } from './Dashboard'
import  useApiCall  from '../hooks/useApiCall'

export const PlayerHookContext = createContext()

const Player = ({ hiddenUI }) => {
    const API = 'https://api.spotify.com/'
    const track_route = ''
    const { queue , setQueue, audioRef } = useContext( DbHookContext )
    const [ playerSize, setPlayerSize ] = useState( 'small' )
    const [ currPlaying, setCurrPlaying ] = useState( {} )
    const [ trackProgress, setTrackProgress ] = useState( 0 );
    const [ isPlaying, setIsPlaying ] = useState( false )
    const [ repeat, setRepeat ] = useState( 'none' )
    const [ shuffle, setShuffle ] = useState( false )
    const trackProgressIntervalRef = useRef()
    const queuedTrackContextRef = useRef([])

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
        setRepeat
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
            }else {
                setTrackProgress( Math.round( audioRef.current.currentTime ) )
            }
        },1000)
    }

// If first track in Queue changes, grabs the full track info of the new first element in Queue array.
    useEffect(() => {
        if( queue[0] ) getTrack( queue[0] )
    },[ queue ])

    const getTrack = ( track ) => {
        console.log(track)
        if( track.album ) {
            console.log('album')
            setCurrPlaying( track )
        } else {
            console.log('no album')
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

    const playTrack = () => {
        setIsPlaying( true )
    }

    const pauseTrack = () => {
        setIsPlaying( false )
    }

    const nextTrack = () => {
        let queueClone = [ ...queue]
        let first = queueClone.shift()
        first['played'] = true
        setQueue( queue => queue = [ ...queue, first] )
    }

    const prevTrack = () => {
        let queueClone = [ ...queue]
        let last = queueClone.pop()
        if( last.played ) delete last['played']
        setQueue( queue => queue = [ last, ...queue] )
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