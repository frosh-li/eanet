module.exports = function( req, res, next ) {
log.info( 'add new api' );
var api = {};
try {
    api = {
        name: req.body.name,
        uri: req.body.uri,
        innerApi: JSON.parse( req.body.innerApi )
    };
    if ( !api || !api.name || !api.uri || api.innerApi.length <= 0 ) {
        return res.json( {
            status: 500,
            msg: '参数错误'
        } );
    }
} catch ( e ) {
    return res.json( {
        status: 500,
        msg: 'innerApi 参数错误'
    } );
}

models.api.insertApi( api ).then( function( rs ) {
    ret = {
        status: 200,
        data: rs
    };
    mongoEmitter.emit( 'db:ready' );
    res.json( ret );
}, function( err ) {
    res.json( {
        status: 500,
        msg: err
    } );
} );
};