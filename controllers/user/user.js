var md5 = require('md5').digest_s;
module.exports = {
    router: "/user/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            req.body.password = md5(req.body.password);
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
            pool.getConnection(function(err, conn) {
                conn.query('select user.* from user where id= '+code, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json({
                        status: 200,
                        data: datas[0]
                    });
                });
                conn.release();
            });
        } else {
            pool.getConnection(function(err, conn) {
                var sql = 'select user.*, role.role_name from user, role where user.role_id = role.id';
                if(req.session.role_type !== 0 && req.session.isadmin === 1){
                    sql += ' and user.comp_id='+req.session.comp_id;
                }
                conn.query(sql, function(err, datas){
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
        var uid = req.params.id;
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            if(req.body.password)
                req.body.password = md5(req.body.password);
            conn.query('update user set ? where id='+uid,req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
        //next();
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
