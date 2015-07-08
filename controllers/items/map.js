var md5 = require('md5').digest_s;
module.exports = {
    router: "/map/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            req.body.comp_id = req.session.comp_id;
            conn.query('insert into comp_good_map set ?',req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    get: function( req, res, next ) {
        log.info( 'api list' );
        var limit = parseInt(req.query.count) || 10;
        var page = parseInt(req.query.page) || 1;
        var start = (page-1)*limit;
        pool.getConnection(function(err, conn) {
            conn.query('select count(*) as total from comp_good_map where comp_id='+req.session.comp_id, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }

                conn.query('select comp_good_map.*, good_info.* from comp_good_map,good_info where good_info.good_id=comp_good_map.good_id and comp_id='+req.session.comp_id+' limit '+start+','+limit, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    console.log(ret);
                    res.json({
                        total:ret[0].total || 0,
                        page:page,
                        result:datas
                    });
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
        var sql = 'delete from comp_good_map where id='+code;
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
