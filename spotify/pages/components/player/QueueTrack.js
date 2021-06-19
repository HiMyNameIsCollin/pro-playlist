import { useState, useEffect, useContext } from 'react'
import { PlayerHookContext } from './Player'
const QueueTrack = ({ track, trackSelected, setTrackSelected }) => {

    const [ selected, setSelected ] = useState( false )
    const { playNextQueue } = useContext( PlayerHookContext )


    const handleTrackSelect = () => {
        const thisTrack = trackSelected.find(( x ) => x.id === track.id)
        if(thisTrack){
            setTrackSelected( trackSelected => trackSelected = trackSelected.filter(( x ) => {
                return x.id !== track.id 
            }))
        } else {
            setTrackSelected( trackSelected => trackSelected = [ track, ...trackSelected ] )
        }
    }

    useEffect(() => {
        const thisTrack = trackSelected.find(( x ) => x.id === track.id)
        if (thisTrack) {
            setSelected( true )
        } else {
            setSelected( false )
        }
    },[ trackSelected ])

    return(
        <div className={ `queueTrack`}>
            <span onClick={ handleTrackSelect } className='queueTrack__radio'>
                <input type='radio' />
                <span className={` queueTrack__radio__control ${ selected && 'queueTrack__radio__control--selected'}`}></span>
            </span>
            
            <h5> { track.name }</h5>
            <p> { track.artists[0].name} </p>

            <i className="fas fa-bars"></i>


        </div>
    )
}

export default QueueTrack