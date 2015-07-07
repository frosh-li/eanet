module.exports = function( req, res, next ) {};
module.exports = {
    router: "/group/",
    post: function( req, res, next ) {
        log.info( 'group list' );
        var groupname = req.body.groupname;
        var apis;
        console.log( req.body );

        // apis用分号分隔
        try {
            apis = JSON.parse( req.body.apilist );
        } catch ( err ) {
            return res.json( {
                status: 500,
                msg: err.message
            } );
        }

        if ( !groupname ) {
            return res.json( {
                status: 500,
                msg: "缺少group参数"
            } );
        }
        if ( !apis ) {
            return res.json( {
                status: 500,
                msg: "缺少apilist参数"
            } );
        }

        if ( !apis || apis.length < 1 ) {
            return res.json( {
                status: 500,
                msg: "api权限不能为空"
            } );
        }

        var group = {
            name: groupname,
            apilist: apis
        };
        log.info( '准备添加分组', group );
        models.group.addGroup( group ).then( function( rs ) {
            ret = {
                status: 200
            };
            log.info( '添加分组成功', rs );
            res.json( ret );
        }, function( err ) {
            res.json( {
                status: 500,
                msg: err
            } );
        } );
    },
    get: function( req, res, next ) {
        log.info( 'group list' );
        var id = req.params.id;
        console.log( id );
        if ( id ) {
            models.group.getOne( OID( id ) ).then( function( rs ) {
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

        models.group.getAll().then( function( rs ) {
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
        log.info( 'delete group' );
        var groupid = req.params.id;
        if ( !groupid ) {
            return res.json( {
                status: 500,
                msg: "缺少group id参数"
            } );
        }

        log.info( '准备删除分组', groupid );
        models.group.deleteGroup( groupid ).then( function( rs ) {
            ret = {
                status: 200
            };
            log.info( '删除分组成功', rs );
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
