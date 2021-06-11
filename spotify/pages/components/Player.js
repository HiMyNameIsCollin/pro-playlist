import PlayerCollapsed from './PlayerCollapsed'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { useState, useEffect, useLayoutEffect, useContext, useRef, createContext} from 'react'
import { DbHookContext } from './Dashboard'
import  useApiCall  from '../hooks/useApiCall'

export const PlayerHookContext = createContext()

const Player = () => {
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
        trackProgressIntervalRef
    }

    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const getTrack_route = 'v1/tracks'
    

// TRACK CURRENTLY PLAYING TRACKS POSITION, WHEN TRACK UN-MOUNTS CLEARS INTERVAL.
    const startTimer = () => {
        if( trackProgressIntervalRef.current ) clearInterval( trackProgressIntervalRef.current )
        trackProgressIntervalRef.current = setInterval(() => {
            if(audioRef.current.ended){
                setTrackProgress(0)
            }else {
                console.log(audioRef.current.currentTime)
                setTrackProgress(audioRef.current.currentTime)
            }
        },1000)
    }

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

    useEffect(() => {
        if(apiPayload){
            setCurrPlaying( apiPayload )
        }
    }, [ apiPayload ])


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
        <div className='player'>
            <PlayerHookContext.Provider value={ playerHookState }>
            {
                playerSize === 'small' ? 
                <PlayerCollapsed  /> :
                null
            }
            </PlayerHookContext.Provider>
            
        </div>
        
    )
}

export default Player