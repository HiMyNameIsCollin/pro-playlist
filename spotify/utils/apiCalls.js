// API CALLS 

const routes = {
    display_name: 'v1/me',
    recently_played: 'v1/me/player/recently-played',
    my_playlists: 'v1/me/playlists',
    featured_playlists: 'v1/browse/featured-playlists',
    all_categories: 'v1/browse/categories',
    my_albums: 'v1/me/albums',
    recommendations: 'v1/recommendations',
    my_top_tracks: 'v1/me/top/tracks',
    my_top_artists: 'v1/me/top/artists',
    // My reducer is based off a set 'Route' string attached during the fetch process,
    // I set the top genre state with a makeshift 'my_top_genres' "route". 
    // Hopefully Spotify adds a top genres route eventually
    my_top_genres: 'genres',
    featured_playlists: 'v1/browse/featured-playlists',
    new_releases: 'v1/browse/new-releases',
    search: 'v1/search',
    available_genre_seeds: 'v1/recommendations/available-genre-seeds'
    
}
const getUser = (...args) => {
    finalizeRoute('get', routes.display_name, ...args)
}

const getMyPlaylists = (...args) => {
    finalizeRoute('get', routes.my_playlists, ...args)
}

const getMyAlbums = (...args) => {
    finalizeRoute('get', routes.my_albums, ...args)
}


const getFeaturedPlaylists = ( ...args ) => {
    finalizeRoute('get', routes.featured_playlists, ...args)
}

const getCategories = ( ...args ) => {
    finalizeRoute('get', routes.all_categories, ...args)
}

const getAvailableGenreSeeds = ( ...args ) => {
    finalizeRoute('get', routes.available_genre_seeds, ...args)
}

const getRecentlyPlayed = ( ...args ) => {
    finalizeRoute('get', routes.recently_played, ...args)
}

const getNewReleases = ( ...args ) => {
    finalizeRoute('get', routes.new_releases, ...args)
}

const getTopTracks = ( ...args ) => {
    finalizeRoute('get', routes.my_top_tracks, ...args)
}

const getTopArtists = ( ...args ) => {
    finalizeRoute('get', routes.my_top_artists, ...args)
}