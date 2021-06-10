import PlayerCollapsed from './PlayerCollapsed'
import { useState, useEffect, useLayoutEffect, useContext } from 'react'
import { DbHookContext } from './Dashboard'
const Player = () => {
    
    const [ playerState, setPlayerState ] = useState('default')
    const { queue } = useContext( DbHookContext )

    // const insertIframe = () => {
    //     return <div dangerouslySetInnerHTML={{ __html: "<iframe src='../../public/silence.mp3' allow='autoplay' id='audio' style='display:none' />"}} />;
    // }

    useEffect(() => {
        if( queue[0] && queue[0].album ){
            const audio = document.getElementById('playAudio')
            console.log(audio)
            audio.pause()
            audio.play()
        }
    }, [queue])

    return(
        <div className='player'>
        {
            playerState === 'default' ? 
            <PlayerCollapsed /> :
            null
        }
        {
            queue[0] && queue[0].preview_url &&
            <>
            
            <audio controls name='media' id='playAudio'>
                <source src={queue[0].preview_url} type='audio/mpeg'/>
            </audio>
            </>
        }

        </div>
            
    )
}

export default Player