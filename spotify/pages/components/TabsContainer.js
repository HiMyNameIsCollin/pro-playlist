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
        const sortedByTime = taggedItems.sort(( a, b ) => b.played_at - a.played_at )
        setData(sortedByTime)
    },[ items ])

    const handleSeeMore = () => {
        const item = { page: 'home', type: 'recPlayed', data: data }
        setSelectOverlay( arr => arr = [ ...arr, item ])
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
                window.innerWidth < 640 ?
                data.slice(0, 6).map(( item, i ) => {
                   return <Tab item={ item } key={ i }/>
                }) 
                :
                window.innerWidth > 640 && window.innerWidth < 1024 ?
                data.slice(0, 9).map(( item, i ) => {
                    return <Tab item={ item } key={ i }/>
                }) 
                :
                window.innerWidth >= 1024 &&
                data.slice(0, 12).map(( item, i ) => {
                    return <Tab item={ item } key={ i }/>
                 })
            }
        </section>
    )
}

export default TabsContainer