module.exports = {
    router: "/rejectOrder/",
    post: function( req, res, next ) {
        var sql = 'update ordermaster set order_reject = 2 where order_reject = 1 and order_id="'+req.body.order_id+'" and supplie_id='+req.session.comp_id;
        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200});
            });
        });
    },
    get: function( req, res, next ) {

        var code = req.params.id;
        if ( code ) {
            console.log(code);
            res.json({status:600});
        } else {
            log.info( 'api list' );
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var ordertype = parseInt(req.query.ordertype) || 0;
            var type = req.query.type || "comp_id";
            var sql = 'select count(*) as total from ordermaster where order_reject != 0 and ';
            sql += type+'=';
            var sql2 = 'select ordermaster.* from ordermaster where order_reject != 0 and ';
            sql += type + '=';
            sql += req.session.comp_id;
            sql2 += req.session.comp_id;

            console.log(sql);
            console.log(sql2);
            pool.getConnection(function(err, conn) {
                conn.query(sql, function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }

                    conn.query(sql2+' limit '+start+','+limit, function(err, datas){
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
            //res.json({status:500});
        }
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        next()
    },
    all: function( req, res, next ) {
        next();
    }
};
