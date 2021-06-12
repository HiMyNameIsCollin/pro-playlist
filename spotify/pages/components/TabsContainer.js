import Tab from './Tab'
import { useState, useEffect } from 'react'
import { finalizeRoute } from '../../utils/finalizeRoute'
import  useApiCall  from '../hooks/useApiCall'

const TabsContainer = ({ items }) => {

    const API = 'https://api.spotify.com/'
    const { fetchApi, apiPayload } = useApiCall(API)
    const [data, setData ] = useState([])
    useEffect(() => {

        items.map((item) => {
            console.log(item)
            if(item.context && item.context.href){
                finalizeRoute('get', item.context.href.substring(API.length), fetchApi)
            } else {
                setData( data => data = [...data, item.track])
            }
        })
    },[ items ])

    useEffect(() => {
        if( apiPayload ) setData( data => data = [...data, apiPayload])

    },[ apiPayload ])



    return(
        <section className='tabsContainer'>
            <div className='tabsContainer__title'>
                <h2>
                    Recently played
                </h2>
                <span>
                    More
                </span>
            </div>
            {
                data.map(( item, i ) => {
                   return <Tab item={ item } key={ i }/>
                })
            }
        </section>
    )
}

export default TabsContainer