var md5 = require('md5').digest_s;
module.exports = {
    router: "/suggest/",
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

        var q = req.query.query;
        if(!/[a-zA-Z]+/.test(q)){
            return res.json({
                status: 500,
                msg:'query error'
            })
        }
        var sql = 'select * from good_info where good_py like "%'+q+'%" limit 0,10';
        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({
                    status: 200,
                    data:datas
                });
            });
            conn.release();
        });

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
