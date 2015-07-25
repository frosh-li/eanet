var md5 = require('md5').digest_s;
module.exports = {
    router: "/getVersion/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        res.json({
            'status': 200,
            'version':'0.0.2'
        });
    },
    put: function( req, res, next ) {
        console.log(req.body);
        var id = req.params.id;
        //next();
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            // req.body.good_company = req.session.comp_id;
            conn.query('update good_info set ? where good_id='+id+' and good_company='+req.session.comp_id,req.body, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
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
        var sql = 'delete from good_info where id='+code + " and good_company="+req.session.comp_id;
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
