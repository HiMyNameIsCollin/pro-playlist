import PlayerCollapsed from './PlayerCollapsed'
import { finalizeRoute } from '../../utils/finalizeRoute'
import { useState, useEffect, useLayoutEffect, useContext } from 'react'
import { DbHookContext } from './Dashboard'
import  useApiCall  from '../hooks/useApiCall'

const Player = () => {
    const API = 'https://api.spotify.com/'
    const track_route = ''
    const { queue } = useContext( DbHookContext )
    const [ playerSize, setPlayerSize ] = useState('small')
    const [ playing, setPlaying ] = useState({})

    const { fetchApi , apiError, apiIsPending, apiPayload  } = useApiCall(API)
    const getTrack_route = 'v1/tracks'

    useEffect(() => {
        if( !playing.id && queue[0] ){
            if( queue[0].album ) {
                setPlaying( queue[0] )
            } else {
                const id = queue[0].id
                finalizeRoute('get', `${ getTrack_route }/${id}`, fetchApi, id)
            }
        }
    },[ queue ])

    useEffect(() => {
        if(apiPayload){
            setPlaying( apiPayload )
        }
    }, [ apiPayload ])

    return(
        <div className='player'>
        {
            playerSize === 'small' ? 
            <PlayerCollapsed playing={ playing } /> :
            null
        }
        </div>
            
    )
}

export default Player