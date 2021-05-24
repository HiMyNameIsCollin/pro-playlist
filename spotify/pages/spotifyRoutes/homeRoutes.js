export const routes = {   
    user_info: 'v1/me',
    recently_played: 'v1/me/player/recently-played',
    my_playlists: 'v1/me/playlists',
    featured_playlists: 'v1/browse/featured-playlists',
    all_categories: 'v1/browse/categories',
    my_albums: 'v1/me/albums',
    recommendations: 'v1/recommendations',
    my_top_tracks: 'v1/me/top/tracks',
    my_top_artists: 'v1/me/top/artists',
    featured_playlists: 'v1/browse/featured-playlists',
    new_releases: 'v1/browse/new-releases',
    search: 'v1/search',
    available_genre_seeds: 'v1/recommendations/available-genre-seeds',
    get_album: 'v1/albums',
    get_artist: 'v1/artists',
    // My reducer is based off a set 'Route' string attached during the fetch process,
    // I set the top genre state with a makeshift 'my_top_genres' "route". 
    // Hopefully Spotify adds a top genres route eventually :(
    my_top_genres: 'genres',
}