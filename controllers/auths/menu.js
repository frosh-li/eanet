module.exports = {
    router: "/menu/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        log.info( 'menu list' );
        models.api.getMenu().then( function( rs ) {
            ret = {
                status: 200,
                data: rs
            };
            res.json( ret );
        }, function( err ) {
            res.json( {
                status: 500,
                msg: err.message
            } );
        } );
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        next();
    },
    all: function( req, res, next ) {
        next();
    }
};
