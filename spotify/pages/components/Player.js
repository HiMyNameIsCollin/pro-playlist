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
    const { queue , audioRef } = useContext( DbHookContext )
    const [ playerSize, setPlayerSize ] = useState('small')
    const [ currPlaying, setCurrPlaying ] = useState({})
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false)
    const trackProgressIntervalRef = useRef()

    const playerHookState ={
        currPlaying,
        setCurrPlaying,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
        trackProgressIntervalRef,
        playerSize,
        setPlayerSize
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
                setTrackProgress(audioRef.current.currentTime)
            }
        },1000)
    }

// If first track in Queue changes, grabs the full track info of the new first element in Queue array.
    useEffect(() => {
        if( queue[0] ) getTrack( queue[0] )
    },[ queue ])

    const getTrack = ( track ) => {
        if( track.album ) {
            setCurrPlaying( track )
        } else {
            const id = track.id
            finalizeRoute('get', `${ getTrack_route }/${id}`, fetchApi, id)
        }
    }

// Tosses received track from the fetch into the player.

    useEffect(() => {
        if(apiPayload){
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

    return(
        <>
            <PlayerHookContext.Provider value={ playerHookState }>
                <PlayerLarge />

                <PlayerCollapsed hiddenUI={ hiddenUI } />
            </PlayerHookContext.Provider>
            
        </>
        
    )
}

export default Player