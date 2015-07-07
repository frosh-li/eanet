module.exports = {
    router: "/logout/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        req.session.destroy();
        res.redirect( req.query.redirect );
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