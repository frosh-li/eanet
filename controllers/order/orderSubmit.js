module.exports = {
    router: "/orderSubmit/",
    post: function( req, res, next ) {
        var order_id = req.body.order_id;
        var yd_id = req.session.comp_id;
        pool.getConnection(function(err, conn) {
            var sql = 'select ordermaster.*, count(orderdetail.oid) as total from ordermaster, orderdetail where ordermaster.order_id=orderdetail.order_id and  ordermaster.order_id="'+order_id+'"';
            console.log(sql);
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                if(!datas || datas.length < 1){
                    return res.json({status: 500, msg:'该订单没有药品，请先添加药品'});
                }


                var ret = datas[0];
                if(ret.total <= 0){
                    return res.json({status: 500, msg:'该订单没有药品，请先添加药品'});
                }
                var newOrderStatus;
                //如果是直接订单，并且是从待处理过来的
                if(ret.order_type == 1 && ret.order_status == 1){
                    // 设置成 2 已经提交  等待批发企业处理
                    newOrderStatus = 2;
                }else if(ret.order_type == 2 && ret.order_status == 1){
                    // 如果是询价订单，并且是新订单，就变成待报价7
                    newOrderStatus = 7;
                }else if(ret.order_type == 2 && ret.order_status == 3){
                    // 如果是询价订单并且已经报价过了  就变成提交正式 设置成 2
                    newOrderStatus = 2;
                }else if(ret.order_status == 4){
                    newOrderStatus = 5;
                }else{
                    return res.json({
                        status: 500,
                        msg:'状态错误'
                    })
                }
                conn.query('update ordermaster set order_status='+newOrderStatus+' where comp_id='+yd_id+' and order_id="'+order_id+'"', function(err, result){
                    if(err){
                        return res.json({
                            status: 500,
                            err:'设置状态失败',
                            msg:err.message
                        });
                    }
                    res.json({
                        status: 200,
                        data: {
                            order_status: ret.order_status,
                            newOrderStatus: newOrderStatus
                        }
                    });
                });
            });
            conn.release();
        });
    },
    get: function( req, res, next ) {
        next();
    },
    put: function( req, res, next ) {
        next();
    },
    delete: function( req, res, next ) {
        next();
    },
    all: function( req, res, next ) {
        next();
    }
};
