import { useState, useEffect } from 'react'

const QueueTrack = ({ track, queueViewSelected, setQueueViewSelected }) => {

    const [ selected, setSelected ] = useState( false )

    const handleTrackSelect = () => {
        const thisTrack = queueViewSelected.find(( x ) => x.id === track.id)
        if(thisTrack){
            setQueueViewSelected( queueViewSelected => queueViewSelected = queueViewSelected.filter(( x ) => {
                return x.id !== track.id 
            }))
        } else {
            setQueueViewSelected( queueViewSelected => queueViewSelected = [ track, ...queueViewSelected ] )
        }
    }

    useEffect(() => {
        const thisTrack = queueViewSelected.find(( x ) => x.id === track.id)
        if (thisTrack) {
            setSelected( true )
        } else {
            setSelected( false )
        }
    },[ queueViewSelected ])

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