export const finalizeRoute = (method, route, func, requestID, ...args) => {
    let finalRoute = route
    
    if(args.length > 0){
        args.forEach((arg, i) => {
            if( i === 0 ) {
                finalRoute += `?${arg}`
            }else {
                finalRoute += `&${arg}`
            }
        })
    }
    func( finalRoute, method , requestID)
}