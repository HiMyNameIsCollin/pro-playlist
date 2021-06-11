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
    

    const playerHookState ={
        currPlaying,
        setCurrPlaying,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
    }

    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const getTrack_route = 'v1/tracks'
    

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
            } else {
                audioRef.current.pause()
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