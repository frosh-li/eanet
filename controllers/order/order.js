module.exports = {
    router: "/order/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            conn.query('insert into ordermaster set ?',req.body, function(err, datas){
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
            log.info( 'api list' );
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var ordertype = parseInt(req.query.ordertype) || 0;
            var type = req.query.type || 1;
            var sql = type == 1 ? 'select count(*) as total from ordermaster where comp_id=':'select count(*) as total from ordermaster where order_status!=1 and supplie_id=';
            var sql2 = type == 1 ? 'select ordermaster.* from ordermaster where  comp_id=' : 'select ordermaster.* from ordermaster where order_status!=1 and  supplie_id=';
            sql += req.session.comp_id;
            sql2 += req.session.comp_id;
            if(ordertype > 0){
                sql += " and order_type="+ordertype + " order by order_id desc";
                sql2 += " and order_type="+ordertype + " order by order_id desc";
            }
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
        log.info( 'api delete' );
        var code = req.params.id;
        if ( !code ) {
            res.json( {
                status: 500,
                msg: "参数缺失:code"
            } );
            return;
        }
        var sql = 'delete from comp_info where id='+code;
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
