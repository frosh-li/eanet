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
            var order_status = req.query.order_status;
            var ifreject = req.query.reject;
            console.log(req.query.showHistory, showHistory);
            var sql = type == 1 ?
                'select count(ordermaster.order_id) as total from ordermaster where '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' order_status>-1 and comp_id='
                :
                'select count(ordermaster.order_id) as total from ordermaster,comp_info where ordermaster.order_status>-1 and comp_info.id=ordermaster.supplie_id and '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' order_status!=1 and supplie_id=';
            var sql2 = type == 1 ?
                'select ordermaster.*,comp_info.name,comp_info.shortname,count(orderdetail.oid) as itemcount ,SUM(orderdetail.good_amount) as total_amount, comp_map.salesman, comp_map.deliveryman  from comp_info,comp_map,ordermaster left join orderdetail on orderdetail.order_id=ordermaster.order_id where comp_map.comp_id_1=ordermaster.supplie_id and comp_map.comp_id_2=ordermaster.comp_id and  ordermaster.order_status>-1 and comp_info.id=ordermaster.'+(req.session.role_type==2?'supplie_id':'comp_id')+' and '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' ordermaster.comp_id=' :
                'select ordermaster.*, comp_info.name,comp_info.shortname,count(orderdetail.oid) as itemcount ,SUM(orderdetail.good_amount) as total_amount,comp_map.salesman, comp_map.deliveryman  from comp_info,comp_map,ordermaster left join orderdetail on orderdetail.order_id=ordermaster.order_id where comp_map.comp_id_1=ordermaster.supplie_id and comp_map.comp_id_2=ordermaster.comp_id and  ordermaster.order_status>-1 and comp_info.id=ordermaster.'+(req.session.role_type==2?'supplie_id':'comp_id')+' and '+(showHistory?'order_status!=5 and':'order_status=5 and ' )+' order_status!=1 and  ordermaster.supplie_id=';
            sql += req.session.comp_id;
            sql2 += req.session.comp_id;
            if(ordertype > 0){
                sql += " and ordermaster.order_type="+ordertype;
                sql2 += " and ordermaster.order_type="+ordertype;
            }
            if(order_status > 0){
                sql += " and ordermaster.order_status="+order_status;
                sql2 += " and ordermaster.order_status="+order_status;
            }
            if(ifreject == 1){
                sql += " and ordermaster.order_reject != 0";
                sql2 += " and ordermaster.order_reject != 0";
            }
            if(req.query.supplie_id){
                sql += ' and '+(type == 0 ? 'ordermaster.comp_id':'supplie_id')+' like "%'+req.query.supplie_id+'%"';
                sql2 += ' and '+(type == 0 ? 'ordermaster.comp_id':'supplie_id')+' like "%'+req.query.supplie_id+'%"';
            }
            if(req.query.supplie_name){
                sql += ' and comp_info.name like "%'+decodeURIComponent(req.query.supplie_name)+'%"';
                sql2 += ' and comp_info.name like "%'+decodeURIComponent(req.query.supplie_name)+'%"';
            }
            if(req.query.supplie_pingying){
                sql += ' and comp_info.name like "%'+decodeURIComponent(req.query.pingying)+'%"';
                sql2 += ' and comp_info.name like "%'+decodeURIComponent(req.query.pingying)+'%"';
            }
            sql += " order by ordermaster.order_id desc";
            sql2 += " group by ordermaster.order_id order by ordermaster.order_id desc";
            console.log(sql);
            console.log(sql2);
            new Promise(function(resolve, reject){
                pool.getConnection(function(err, conn) {
                    if(err){
                        return reject(err);
                    }
                    resolve(conn);
                });
            }).then(function(conn){
                return new Promise(function(resolve, reject){
                    conn.query(sql, function(err, ret){
                        if(err){
                            // return {conn, conn, data: err};
                            return reject(err);
                            // return res.json({status: 500, err: err.message});
                        }
                        console.log(ret);
                        resolve({conn: conn, ret: ret});
                    });
                });

                // conn.release();
            }).then(function(data){
                console.log(data);
                var conn = data.conn;
                var ret = data.ret;
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
        var sql = 'update ordermaster set order_status=-1 where order_id="'+code+'"';
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
