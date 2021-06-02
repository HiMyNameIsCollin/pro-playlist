export const whichPicture = (arr, pref) => {

    if(pref === 'med' || !pref){
        if( arr[1] ) return arr[1].url
        if( arr[0] ) return arr[0].url
        if( arr[2] ) return arr[2].url
        
    } else if ( pref === 'sm'){
        if( arr[2] ) return arr[2].url
        if( arr[1] ) return arr[1].url
        return arr[0].url
    } else if ( pref === 'lrg'){
        return arr[0].url
    }
}
