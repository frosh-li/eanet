module.exports = {
    getAll: function() {
        return new Promise( function( resolve, reject ) {
            db.group.find( {}, function( err, groups ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( groups );
                }
            } );
        } );
    },
    getOne: function( arg ) {
        return new Promise( function( resolve, reject ) {
            db.group.findOne( { _id: arg }, function( err, group ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( group );
                }
            } );
        } );
    },
    getByGroupName: function( groupname ) {
        return new Promise( function( resolve, reject ) {
            db.group.findOne( { name: groupname }, function( err, group ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( group );
                }
            } );
        } );
    },
    addGroup: function( new_group ) {
        var group = new db.group( new_group );
        return new Promise( function( resolve, reject ) {
            group.save( function( err, saved ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( saved );
                }
            } );
        } );
    },
    editGroup: function( eGroup ) {
        var group_id = eGroup._id;
        var sets = {};
        for ( var key in eGroup ) {
            if ( key !== "_id" ) {
                sets[ key ] = eGroup[ key ];
            }
        }
        return new Promise( function( resolve, reject ) {
            db.group.findOneAndUpdate( { _id: group_id }, { $set: sets }, function( err, ngroup ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( ngroup );
                }
            } );
        } );
    },
    deleteGroup: function( groupid ) {
        return new Promise( function( resolve, reject ) {
            db.group.remove( { _id: groupid }, function( err, remove ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else if ( !remove ) {
                    var error = new Error( '找不到数据' + groupid );
                    log.error( error );
                    reject( error );
                } else {
                    resolve( remove );
                }
            } );
        } );
    },
    addApiToGroup: function( groupid, api ) {
        // api可以为数组或者字符串
        api = typeof api === 'object' ? api : [ api ];
        return new Promise( function( resolve, reject ) {
            db.group.findOneAndUpdate( { _id: groupid }, { $addToSet: { apilist: { $each: api } } }, function( err, apilists ) {
                if ( err ) {
                    log.error( err );
                    reject( err );
                } else {
                    resolve( apilists );
                }
            } );
        } );
    }
};
