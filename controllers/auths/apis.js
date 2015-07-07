module.exports = {
    router: "/apis/",
    post: function( req, res, next ) {
        log.info( 'api register' );

        var code = req.body.code;
        var model = req.body.model;
        var uri = req.body.uri;

        var innerApi = {};
        if ( req.body.innerApi ) {
            try {
                innerApi = JSON.parse( req.body.innerApi );
            } catch ( err ) {
                return res.json( {
                    status: 500,
                    msg: err.message
                } );
            }
            console.log( innerApi );
            for ( var i in innerApi ) {
                if ( innerApi[ i ].url.substr( 0, 1 ) != "/" )
                    innerApi[ i ].url += "/";
            }
        }

        var ret = {
            status: 500,
            msg: "请求参数缺失"
        };

        if ( !code || !model || !uri )
            return res.json( ret );

        console.log( req.body );

        models.api.insertApi( {
            code: code,
            model: model,
            uri: uri,
            innerApi: innerApi
        } ).then( function( rs ) {
            loadRouter();
            log.info( '添加/更新Api成功', rs );
            res.json( {
                status: 200,
                msg: '添加/更新Api成功'
            } );
        }, function( err ) {
            res.json( {
                status: 500,
                msg: err.message
            } );
        } );
    },
    get: function( req, res, next ) {
        var code = req.params.id;
        if ( code ) {
            log.info( 'api get ' + code );
            models.api.getApi( code ).then( function( rs ) {
                ret = {
                    status: 200,
                    msg: rs ? "查询成功" : "没有数据",
                    data: rs ? rs : []
                };
                res.json( ret );
            }, function( err ) {
                res.json( {
                    status: 500,
                    msg: err.message
                } );
            } );
        } else {
            log.info( 'api list' );
            models.api.getAll().then( function( rs ) {
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
        }
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        log.info( 'api delete' );
        var code = req.params.id;
        if ( !code ) {
            res.json( {
                status: 500,
                msg: "参数缺失:code"
            } );
            return;
        }

        models.api.deleteOne( code ).then( function( rs ) {
            res.json( {
                status: 200,
                data: "删除成功"
            } );
        }, function( err ) {
            loadRouter();
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
