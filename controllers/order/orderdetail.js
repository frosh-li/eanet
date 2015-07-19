module.exports = {
    router: "/orderdetail/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            var good_id = req.body.good_id;
            var data = {
                good_id: parseInt(req.body.good_id),
                good_number: parseInt(req.body.good_number),
                order_id : req.body.order_id
            };
            var sql = 'select good_name,good_gg,good_dw,good_cp,good_pzwh from good_info where good_id='+good_id;
            conn.query(sql, function(err, good){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                if(!good || good.length < 1){
                    return res.json({status: 500, msg: err.message});
                }
                var cgood = good[0];
                console.log(good);
                for(var key in cgood){
                    data[key] = cgood[key];
                }
                console.log('data',data);
                conn.query('insert into orderdetail set ?',data, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json({status: 200, data: datas});
                });
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
            log.info( 'api list' );
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var order_id = req.query.order_id;
            pool.getConnection(function(err, conn) {
                conn.query('select count(*) as total from orderdetail where order_id="'+order_id+'"', function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }

                    conn.query('select * from orderdetail where order_id="'+order_id+'" limit '+start+','+limit, function(err, datas){
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
        log.info( 'api delete' );
        var code = req.params.id;
        if ( !code ) {
            res.json( {
                status: 500,
                msg: "参数缺失:code"
            } );
            return;
        }
        var sql = 'delete from orderdetail where oid='+code;
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
