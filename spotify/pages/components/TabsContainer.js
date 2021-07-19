import Tab from './Tab'
import { useState, useEffect, useRef } from 'react'
import  useApiCall  from '../hooks/useApiCall'

const TabsContainer = ({ items }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute, apiPayload } = useApiCall(API)
    const [ data, setData ] = useState([])

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

    return(
        <section className='tabsContainer'>
            <div className='tabsContainer__title'>
                <h4>
                    Recently played
                </h4>
                <span>
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