var md5 = require( 'md5' ).digest_s;
module.exports = {
    router: "/user/",
    post: function( req, res, next ) {
        log.info( 'new user' );
        var username = req.body.username.trim().replace( /\s/g, "" );
        var userid = req.body.id;
        var group = req.body.group.trim().replace( /\s/g, "" );
        var password = req.body.password.trim().replace( /\s/g, "" );
        var merchantID = req.body.merchantID.trim();
        var now = new Date();
        var ret500 = {
            status: 500,
            msg: "请求参数非法"
        };
        if ( !username || !group || !password ) {
            return res.json( ret500 );
        }
        async.waterfall( [
            function( cb ) {
                models.user.findOne( { username: username } ).then( function( rs ) {
                    if ( rs ) {
                        cb( new Error( '用户已经存在' ) );
                    } else {
                        cb( null, null );
                    }

                }, function( err ) {
                    cb( err, null );
                } );
            },
            function( _, cb ) {
                models.user.addUser( {
                    "auth": [ "/" ],
                    "created": now,
                    "lastlogin": now,
                    "password": md5( password ),
                    "platformid": "1",
                    "platformname": "主平台",
                    "token": "",
                    "username": username,
                    "group": group,
                    "merchantID": merchantID
                } ).then( function( rs ) {
                    log.info( '添加用户成功', rs );
                    console.log( _, cb, cb.toString() );
                    cb( null );
                }, cb );
            }
        ], function( err, ret ) {
            if ( err ) {
                res.json( {
                    status: 500,
                    msg: err.message
                } );
            } else {
                res.json( {
                    status: 200
                } );
            }
        } );
    },
    get: function( req, res, next ) {
        log.info( 'group list' );
        var id = req.params.id;

        if ( id ) {
            models.user.findOne( { _id: OID( id ) } ).then( function( rs ) {
                ret = {
                    status: 200,
                    data: rs
                };
                res.json( ret );
            }, function( err ) {
                res.json( {
                    status: 500,
                    msg: err
                } );
            } );
            return;
        }

        models.user.getAll().then( function( rs ) {
            ret = {
                status: 200,
                data: rs
            };
            res.json( ret );
        }, function( err ) {
            res.json( {
                status: 500,
                msg: err
            } );
        } );
        models.user.getAll().then( function( rs ) {
            ret = {
                status: 200,
                data: rs
            };
            res.json( ret );
        }, function( err ) {
            res.json( {
                status: 500,
                msg: err
            } );
        } );
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        log.info( 'delete user' );
        var _id = req.params.id;
        models.user.deleteUser( _id ).then( function( rs ) {
            ret = {
                status: 200,
                msg: '删除成功',
                data: rs
            };
            res.json( ret );
        }, function( err ) {
            res.json( {
                status: 500,
                msg: err
            } );
        } );
    },
    all: function( req, res, next ) {
        next();
    }
};
