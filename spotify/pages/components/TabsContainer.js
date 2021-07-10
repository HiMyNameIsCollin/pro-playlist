import Tab from './Tab'
import { useState, useEffect, useRef } from 'react'
import  useApiCall  from '../hooks/useApiCall'

const TabsContainer = ({ items }) => {

    const API = 'https://api.spotify.com/'
    const { finalizeRoute, apiPayload } = useApiCall(API)
    const [ data, setData ] = useState([])
    const messyDataRef = useRef([])
    const played_atRef = useRef([])

    useEffect(() => {
        items.map((item) => {
            if(item.context && item.context.href){
                finalizeRoute('get', item.context.href.substring(API.length))
                played_atRef.current = [ ...played_atRef.current, item.played_at]
            } else {
                
                item.track['played_at'] = item.played_at
                messyDataRef.current = [...messyDataRef.current, item.track]
            }
        })
    },[ items ])

    useEffect(() => {
        if( apiPayload ) {
            apiPayload['played_at'] = played_atRef.current[0]
            played_atRef.current.shift()
            messyDataRef.current = [ ...messyDataRef.current, apiPayload]
        }
        if( messyDataRef.current.length === items.length) {
            organizeData( messyDataRef.current )
           
        }
    },[ apiPayload ])

    useEffect(() => {
        if( data.length > 0 ) messyDataRef.current = []
    }, [ data ])

    const organizeData = ( arr ) => {
        let newArr = arr.slice().sort(( a, b ) => b.played_at - a.played_at)
        let finalArr = newArr.reduce((acc, item) => {
            let dupe = acc.find( x => x.id === item.id )
            if( !dupe ) {
                acc.push( item )
            }
            return acc
        },[])
        
       setData( finalArr )
    }

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