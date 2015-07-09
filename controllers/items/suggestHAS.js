var md5 = require('md5').digest_s;
module.exports = {
    router: "/suggestHAS/",
    post: function( req, res, next ) {
        next()
    },
    get: function( req, res, next ) {

        var q = req.query.query;
        var companyid = req.query.companyid;
        if(!/^2[0-9]{5}$/.test(companyid)){
            return res.json({
                status: 500,
                msg:"需要传入企业ID"
            });
        }
        if(!/[a-zA-Z]+/.test(q)){
            return res.json({
                status: 500,
                msg:'query error'
            })
        }
        var sql = 'select * from good_info,comp_good_map  where comp_good_map.good_id=good_info.good_id and comp_good_map.comp_id='+companyid+' and good_py like "%'+q+'%" limit 0,10';
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
