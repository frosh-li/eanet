
var md5 = require( 'md5' ).digest_s;
module.exports = {
    router: "/login/",
    post: function( req, res, next ) {
        log.debug( 'ok', req.body );
        var username = req.body.username,
            password = req.body.password;
        var ret;
        if ( !username || !password ) {
            ret = {
                status: 500,
                msg: '登录失败'
            };
            log.debug( ret );
            return res.json( ret );
        }

        models.user.login( username, password ).then( function( rs ) {

            var group = rs.group;
            models.api.getAll().then( function( apis ) {
                var modules = [];
                apis.forEach( function( api ) {
                    modules.push( api.code );
                } );
                ret = {
                    status: 200,
                    data: {
                        uid: rs._id,
                        token: rs.token,
                        expire: 7200,
                        modules: modules,
                        user: {
                            username: rs.username,
                            group: rs.group,
                            uid: rs._id,
                            merchantID: rs.merchantID,
                            ip: req.connection.remoteAddress.match( /\d+\.\d+\.\d+\.\d+/ )[ 0 ] || "0.0.0.0"
                        }
                    }
                };
                req.session.uid = rs._id;
                req.session.username = rs.username;
                req.session.merchantID = rs.merchantID;
                console.log( ret );
                res.json( ret );
            }, function( err ) {
                res.json( {
                    status: 500,
                    msg: err.message
                } );
            } );
        }, function( err ) {
            res.json( {
                status: 500,
                msg: err.message
            } );
        } );
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
