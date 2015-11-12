var md5 = require('md5').digest_s;
module.exports = {
    router: "/user/",
    post: function( req, res, next ) {
        req.body.password = md5(req.body.password);
        new Promise(function(resolve, reject){
            pool.getConnection(function(err, con){
                if(err){
                    return reject(err);
                }
                resolve(con);
            });
        }).then(function(conn){
            return new Promise(function(resolve, reject){
                conn.query('select * from user where username = "'+req.body.username+'"', function(err, datas){
                    if(err){
                        return reject(err);
                    }
                    if(datas.length > 0){
                        return reject(new Error('用户名已经存在'));
                    }
                    resolve([datas,conn]);
                });
            });
        }).then(function(data){
            var user=data[0],
                conn = data[1];
            return new Promise(function(resolve, reject){
                 conn.query('insert into user set ?',req.body, function(err, datas){
                     if(err){
                         return reject(err);
                     }
                     resolve({status: 200, data: datas});
                 });
                 conn.release();
            });
        }).catch( function(error){
        //    conn.release();
            console.log(error);
            return res.json({status: 500, err: error.message || error});
        }).then(function(data){
            return res.json(data);
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
