module.exports = {
    router: "/order/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');
            conn.query('select count(*) as total from ordermaster  where supplie_id='+req.body.supplie_id+' and order_status = 1 and order_type=1 and comp_id='+req.session.comp_id, function(err,ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                console.log(ret);
                if(ret && ret[0]['total'] > 0){
                    return res.json({status: 500, msg:'有未处理完的订单，请先处理'});
                }

                conn.query('insert into ordermaster set ?',req.body, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    console.log(datas);
                    console.log('insert order id', datas.insertId);
                    res.json({status: 200, data: datas});
                });
                conn.release();
            });

        });
    },
    get: function( req, res, next ) {

        var code = req.params.id;
        if ( code ) {
            console.log(code);
            res.json({status:600});
        } else {
			console.log('session');
			console.log(req.session);
            var limit = parseInt(req.query.count) || 10;
            var page = parseInt(req.query.page) || 1;
            var start = (page-1)*limit;
            var ordertype = parseInt(req.query.ordertype) || 0;
            var type = req.query.type || 1;
            var showHistory = req.query.showHistory == 0?true:false;
            console.log(req.query.showHistory, showHistory);
            var sql = type == 1 ?
                'select count(ordermaster.order_id) as total from ordermaster where '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' comp_id='
                :
                'select count(ordermaster.order_id) as total from ordermaster,comp_info where comp_info.id=ordermaster.supplie_id and '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' order_status!=1 and supplie_id=';
            var sql2 = type == 1 ? 'select ordermaster.* from ordermaster where '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' comp_id=' : 'select ordermaster.* from ordermaster,comp_info where comp_info.id=ordermaster.supplie_id and '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' order_status!=1 and  supplie_id=';
            sql += req.session.comp_id;
            sql2 += req.session.comp_id;
            if(ordertype > 0){
                sql += " and order_type="+ordertype;
                sql2 += " and order_type="+ordertype;
            }
            if(req.query.supplie_id){
                sql += ' and '+(type == 0 ? 'comp_id':'supplie_id')+' like "%'+req.query.supplie_id+'%"';
                sql2 += ' and '+(type == 0 ? 'comp_id':'supplie_id')+' like "%'+req.query.supplie_id+'%"';
            }
            if(req.query.supplie_name){
                sql += ' and comp_info.name like "%'+decodeURIComponent(req.query.supplie_name)+'%"';
                sql2 += ' and comp_info.name like "%'+decodeURIComponent(req.query.supplie_name)+'%"';
            }
            if(req.query.supplie_pingying){
                sql += ' and comp_info.name like "%'+decodeURIComponent(req.query.pingying)+'%"';
                sql2 += ' and comp_info.name like "%'+decodeURIComponent(req.query.pingying)+'%"';
            }
            sql += " order by order_id desc";
            sql2 += " order by order_id desc";
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
        var sql = 'delete from ordermaster where order_id="'+code+'"';
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
