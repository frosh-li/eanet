var md5 = require( 'md5' ).digest_s;
module.exports = {
    getAll: function() {
        return new Promise( function( resolve, reject ) {
            db.user.find( {}, function( err, users ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( users );
                }
            } );
        } );
    },
    addUser: function( user ) {
        var insert = new db.user( user );
        return new Promise( function( resolve, reject ) {
            insert.save( function( err, savedUser ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( savedUser );
                }
            } );
        } );
    },
    deleteUser: function( userid ) {
        return new Promise( function( resolve, reject ) {
            db.user.remove( { _id: userid }, function( err, remove ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else if ( !remove ) {
                    var error = new Error( '找不到数据' + userid );
                    log.error( error );
                    reject( error );
                } else {
                    resolve( remove );
                }
            } );
        } );
    },
    findOne: function( user ) {
        return new Promise( function( resolve, reject ) {
            db.user.findOne( user, function( err, user ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( user );
                }
            } );
        } );
    },
    login: function( username, password ) {
        var token = uuid.v1();
        return new Promise( function( resolve, reject ) {
            db.user.findOneAndUpdate( { username: username, password: md5( password ) }, { $set: {
                    token: token,
                    lastlogin: new Date()
            } }, function( err, user ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else if ( !user ) {
                    reject( new Error( 'username or password error' ) );
                } else {
                    user.token = token;
                    log.info( 'token', user.token );
                    resolve( user );
                }
            } );
        } );
    },
    checkLogin: function( uid ) {
        return new Promise( function( resolve, reject ) {
            db.user.findById( OID( uid ), function( err, user ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    if ( !user ) {
                        return reject( new Error( 'error password' ) );
                    }
                    resolve( user );
                }
            } );
        } );
    }
};