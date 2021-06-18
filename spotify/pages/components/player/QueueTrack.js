
const QueueTrack = ({ track }) => {
    return(
        <div className='queueTrack'>
                        <span className='queueTrack__radio'><input type='radio' />
                <span className='queueTrack__radio__control'></span>
            </span>
            <h5> { track.name }</h5>
            <p> { track.artists[0].name} </p>

            <i className="fas fa-bars"></i>


        </div>
    )
}

export default QueueTrack