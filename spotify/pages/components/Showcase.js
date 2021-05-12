import { useState, useEffect } from 'react'

const Showcase = ({ location }) => {

    useEffect(() => {
        const id = location.pathname.substr(10)
        console.log(id)
    }, [])
    return(
        <div className='page page--bg'>
            
        </div>
    )
}

export default Showcase