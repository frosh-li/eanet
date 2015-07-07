module.exports = {
    router: "/user/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            conn.query('insert into user set ?',req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    get: function( req, res, next ) {
        var code = req.params.id;
        if ( code ) {
            console.log(code);
            res.json({status:600});
        } else {
            pool.getConnection(function(err, conn) {
                conn.query('select user.*, role.role_name from user, role where user.role_id = role.id limit 0,30', function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json(datas);
                });
                conn.release();
            });
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
        var sql = 'delete from user where id='+code;
        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    all: function( req, res, next ) {
        next();
    }
};
