export const getSeeds = ( genreSeeds , theseArtists, theseTracks ) => {
    let seeds = {
        seedGenres: [],
        seedArtists: [],
        seedTracks: []
    }
    let { seedGenres, seedArtists, seedTracks } = seeds
    theseArtists.forEach(( artist, i ) => {
        artist.genres.forEach(( genre, j ) => {
            if(genreSeeds.includes( genre )){
                if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
                seedGenres.push( genre )
                }
            }
        })
        if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
            seedArtists.push( artist.id )
        }
    })
    theseTracks.forEach( track => {
        if( seedGenres.length + seedArtists.length + seedTracks.length < 5){
            seedTracks.push( track.id )
        }
    })
    let args = []
    if(seedGenres.length > 0) args.push( `seed_genres=${seedGenres.join()}` )
    if( seedArtists.length > 0 ) args.push(`seed_artists=${seedArtists.join()}` )
    if( seedTracks.length > 0 ) args.push( `seed_tracks=${seedTracks.join()}` )
    return args
}