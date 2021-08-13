import Tab from './Tab'
import { useState, useEffect, useRef, useContext } from 'react'
import { DbHookContext } from './Dashboard'

const TabsContainer = ({ items }) => {

    const [ data, setData ] = useState([]) 

    const { selectOverlay, setSelectOverlay } = useContext( DbHookContext )

    useEffect(() => {
        const taggedItems = items.map(( item, i ) => {
            let taggedItem 
            if( item.context && item.context.href ){
                item.track['played_at'] = item['played_at']
            } 
            item.track['context'] = item['context']
            taggedItem = item.track
            return taggedItem 
        })
        const sorted = taggedItems.sort(( a, b ) => b.played_at - a.played_at )
        setData(sorted)
    },[ items ])

    const handleSeeMore = () => {
        setSelectOverlay({ page: 'home', type: 'recPlayed', data: data })
    }

    return(
        <section className='tabsContainer'>
            <div className='tabsContainer__title'>
                <p>
                    Recently played
                </p>
                <span onClick={ handleSeeMore }>
                    More
                </span>
            </div>
            {
                data.slice(0, 6).map(( item, i ) => {
                   return <Tab item={ item } key={ i }/>
                })
            }
        </section>
    )
}

export default TabsContainer