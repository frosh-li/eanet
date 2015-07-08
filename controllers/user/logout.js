
var md5 = require( 'md5' ).digest_s;
module.exports = {
    router: "/logout/",
    post: function( req, res, next ) {
        req.session.destroy();
        res.json({status:200});
    },
    get: function( req, res, next ) {
        next();
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
