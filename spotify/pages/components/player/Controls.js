import { useContext } from 'react'
import { PlayerHookContext } from './Player'

const Controls = ({ controls }) => {

    const  { repeat, isPlaying, shuffle, setShuffle } = useContext( PlayerHookContext )
    const { playTrack, pauseTrack, nextTrack, prevTrack, handleRepeat } = controls

    return(
        <div className='controls'>
            <button
                onClick={ handleRepeat } 
                className={
                    `controls__trackBtn 
                    ${ repeat !== 'none' && 'controls__trackBtn--active' }`
                }>
                {
                    repeat === 'none' ?
                    <i className="fas fa-sync"></i> :
                    repeat === 'all' ?
                    <i className="fas fa-sync"></i> :
                    repeat === 'one' &&
                    <>
                    <i className="fas fa-sync"></i> 
                    <span>1</span>
                    </>
                }
            </button>
            <button
                onClick={ prevTrack } 
                className='controls__trackBtn'>
                <i className="fas fa-step-backward"></i>
            </button>
            <button 
            onClick={ isPlaying ? pauseTrack : playTrack }
            className='controls__playBtn' >
            {
                isPlaying ?
                <i className="fas fa-pause "></i>:
                <i className="fas fa-play "></i>

            }
            </button>
            <button
                onClick={ nextTrack } 
                className='controls__trackBtn'>
                <i className="fas fa-fast-forward"></i>
            </button>
            <button
                onClick={ () => setShuffle( !shuffle )} 
                className={
                    `controls__trackBtn ${ shuffle && 'controls__trackBtn--active'}`
                }>
                <i className="fas fa-american-sign-language-interpreting"></i>
            </button>
        </div>                                      
    )
}

export default Controls