import DynamicTitle from '../DynamicTitle'
import ReleaseCard from './ReleaseCard'
import { useContext , useEffect, useState } from 'react'
import { DbFetchedContext, DbHookContext } from '../Dashboard'

const Banner = () => {

    const [ data, setData ] = useState( {} )
    const { my_top_artists, followed_artists, my_top_tracks, my_liked_tracks, new_releases ,  } = useContext( DbFetchedContext )
    const { myNewReleasesRef } = useContext( DbHookContext )
    useEffect(() =>{
        const findArtists = ( acc, val, arr ) => {
            val.artists.forEach( item => {
                const found = arr.filter( x => x.name === item.name )
                if( found.length > 0 ) acc = [ ...acc, { artist: item, item: val, type: 'new release' }]
            }) 
            return acc
        }
        if( my_top_artists.length > 0 &&  followed_artists.length > 0 && new_releases.length > 0 && !data.type ){
            if( !myNewReleasesRef.current[0] ){
                let result = new_releases.reduce(( acc, val ) => findArtists( acc, val, [ ...followed_artists, ...my_top_artists ] ),[])
                if( result.length > 0 ) {
                    setData( result[ Math.floor( Math.random() * result.length ) ] )
                    myNewReleasesRef.current = [ ...myNewReleasesRef.current, ...result ]
                }           
            } else {
                setData( myNewReleasesRef.current[ Math.floor( Math.random() * myNewReleasesRef.current.length )])
            }
        }
        
    },[ my_top_artists, followed_artists, new_releases ])
    return(
        <section className={`banner ${ !data.type && 'banner--disabled'}`} >
            { 
            data.type &&
            <>
                <DynamicTitle message={ `New release by:` } item={ data } />
                <ReleaseCard item={ data.item } />
            </>
            }

        </section>
    )
}

export default Banner