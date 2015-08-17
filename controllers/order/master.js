module.exports = {
    router: "/master/",
    post: function( req, res, next ) {
        var supplie_id = req.body.supplie_id;
        var sql = 'select * from ordermaster where order_type=1 and order_status=1 and supplie_id='+supplie_id+' and comp_id='+req.session.comp_id;
        if(parseInt(req.body.number) < 1){
            return res.json({status: 500, msg:'请输入正确数量'});
        }
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                if(!ret || ret.length <= 0){
                    // 如果不存在就创建订单
                    // var orderdate ="20121313";
                    var date = new Date();
                    var orderdate = date.getFullYear()+""
                            + (date.getMonth()+1 < 10 ? ("0"+(date.getMonth()+1).toString()):(date.getMonth()+1).toString())
                            + (date.getDate() < 10 ? ("0"+(date.getDate()).toString()):(date.getDate()).toString());
                    console.log(orderdate);
                    var autoInsert = "insert into ordermaster(order_oper, supplie_id, order_date, order_type, comp_id, order_status) values('"+req.session.username+"',"+supplie_id+","+orderdate+", 1,"+req.session.comp_id+",1)";
                    conn.query(autoInsert, function(err, autoResult){
                        if(err){
                            return res.json({status: 500, err: err.message});
                        }
                        conn.query(sql, function(err, ret2){
                            if(err){
                                return res.json({status: 500, err: err.message});
                            }
                            if(!ret2 || ret2.length <= 0 ){
                                return ret2.json({status: 500, err: '自动新建订单失败'});
                            }
                            var order_id = ret2[0]['order_id'];
                            var sqlInsert = "insert into orderdetail(order_id, good_id, good_number,good_price, good_amount, good_name,good_gg,good_dw, good_cp, good_pzwh) values";
                            var insert_array = [
                                    "('"+order_id+"'",
                                    parseInt(req.body.good_id),
                                    parseInt(req.body.number),
                                    "(select good_price from good_info where good_id="+parseInt(req.body.good_id)+")",
                                    "(select good_price*"+parseInt(req.body.number)+" from good_info where good_id="+parseInt(req.body.good_id)+")",
                                    "(select good_name from good_info where good_id="+parseInt(req.body.good_id)+")",
                                    "(select good_gg from good_info where good_id="+parseInt(req.body.good_id)+")",
                                    "(select good_dw from good_info where good_id="+parseInt(req.body.good_id)+")",
                                    "(select good_cp from good_info where good_id="+parseInt(req.body.good_id)+")",
                                    "(select good_pzwh from good_info where good_id="+parseInt(req.body.good_id)+"))"
                            ];
                            conn.query(sqlInsert+insert_array.join(','), function(err, ret){
                                if(err){
                                    return res.json({
                                        status: 500,
                                        msg: err.message
                                    });
                                }
                                return res.json({
                                    status: 200,
                                    insertId: ret.insertId
                                })
                            });
                        });
                    });
                }else{
                    // 如果存在直接加入到订单中
                    var order_id = ret[0].order_id;
                    conn.query('select * from orderdetail where order_id="'+order_id+'" and good_id='+parseInt(req.body.good_id), function(err, c){
                        if(err){
                            return res.json({
                                status: 500,
                                msg: err.message
                            });
                        }
                        if(c && c.length > 0){
                            return res.json({
                                status: 500,
                                msg: '该药品已经在订单中已经存在，请不要重复添加'
                            });
                        }
                        var sqlInsert = "insert into orderdetail(order_id, good_id, good_number,good_price, good_amount, good_name,good_gg,good_dw, good_cp, good_pzwh) values";
                        var insert_array = [
                                "('"+order_id+"'",
                                parseInt(req.body.good_id),
                                parseInt(req.body.number),
                                "(select good_price from good_info where good_id="+parseInt(req.body.good_id)+")",
                                "(select good_price*"+parseInt(req.body.number)+" from good_info where good_id="+parseInt(req.body.good_id)+")",
                                "(select good_name from good_info where good_id="+parseInt(req.body.good_id)+")",
                                "(select good_gg from good_info where good_id="+parseInt(req.body.good_id)+")",
                                "(select good_dw from good_info where good_id="+parseInt(req.body.good_id)+")",
                                "(select good_cp from good_info where good_id="+parseInt(req.body.good_id)+")",
                                "(select good_pzwh from good_info where good_id="+parseInt(req.body.good_id)+"))"
                        ];
                        conn.query(sqlInsert+insert_array.join(','), function(err, ret){
                            if(err){
                                return res.json({
                                    status: 500,
                                    msg: err.message
                                });
                            }
                            return res.json({
                                status: 200,
                                insertId: ret.insertId
                            })
                        });
                    });

                }
                conn.release();
            });

        });
    },
    get: function( req, res, next ) {

        var code = req.params.id;
        if ( code ) {
            next()
        } else {
            next();


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
