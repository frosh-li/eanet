var mongoose = require( 'mongoose' );
var Promise = require( 'promise' );
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = {
    getAll: function() {
        return new Promise( function( resolve, reject ) {
            db.api.find( {}, function( err, apis ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( apis );
                }
            } );
        } );
    },
    getMenu: function() {
        return new Promise( function( resolve, reject ) {
            db.api.find( { "innerApi.isMenu": "true" }, function( err, apis ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( apis );
                }
            } );
        } );
    },
    insertApi: function( api ) {
        return new Promise( function( resolve, reject ) {
            db.api.findOneAndUpdate( { code: api.code }, { code: api.code, uri: api.uri, innerApi: api.innerApi, model: api.model }, { upsert: true }, function( err, saved ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( saved );
                }
            } );
        } );
    },
    getApi: function( id ) {
        return new Promise( function( resolve, reject ) {
            db.api.findById( OID( id ), function( err, api ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    log.info( 'get one api ', api );
                    resolve( api );
                }
            } );
        } );
    },
    deleteOne: function( id ) {
        return new Promise( function( resolve, reject ) {
            db.api.remove( { _id: OID( id ) }, function( err, api ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( api );
                }
            } );
        } );
    }
};