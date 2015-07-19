module.exports = {
    router: "/master/",
    post: function( req, res, next ) {
        var supplie_id = req.body.supplie_id;
        var sql = 'select * from ordermaster where order_type=1 and order_status=1 and supplie_id='+supplie_id+' and comp_id='+req.session.comp_id;
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, ret){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                if(!ret || ret.length <= 0){
                    // 如果不存在就创建订单
                    return res.json({
                        status: 500,
                        msg: '请先创建订单'
                    })
                }else{
                    // 如果存在直接加入到订单中
                    var order_id = ret[0].order_id;
                    var sqlInsert = "insert into orderdetail(order_id, good_id, good_number,good_price, good_amount, good_name,good_gg,good_dw, good_cp, good_pzwh) values";
                    var insert_array = [
                            "('"+order_id+"'",
                            parseInt(req.body.good_id),
                            parseInt(req.body.number),
                            "(select good_price from good_info where good_id="+parseInt(req.body.good_id)+")",
                            0,
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
