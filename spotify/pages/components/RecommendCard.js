import { useEffect , useState, useContext } from 'react'
import Slider from './Slider'
import { SearchHookContext } from './Search'
const RecommendCard = () => {

    const { setActiveSearchItem } = useContext( SearchHookContext )

    return(
        <div className='recommendCard'>
            <div className='recommendCard__artist'>
                <div className='recommendCard__imgContainer'>
                    <img src='http://robohash.org/test' />
                </div>
                <h3>
                    J. Cole
                </h3>   
            </div>
            
            <Slider message='Appears on:' items={ [] } setActiveItem={ setActiveSearchItem }/>
        </div>
    )
}

export default RecommendCard