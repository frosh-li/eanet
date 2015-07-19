module.exports = {
    router: "/orderPFSubmit/",
    post: function( req, res, next ) {
        var order_id = req.body.order_id;
        var yd_id = req.session.comp_id;
        pool.getConnection(function(err, conn) {
            conn.query('select * from ordermaster where order_id="'+order_id+'"', function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                if(!datas || datas.length < 1){
                    return res.json({status: 500, msg:'找不到订单'});
                }

                var ret = datas[0];
                var newOrderStatus;
                console.log('order_status', ret.order_status);
                if(ret.order_status == 2){
                    newOrderStatus = 8;
                }else if(ret.order_status == 6){
                    // 6已经导出的直接订单 变成已经确认
                    newOrderStatus = 8;
                }else if(ret.order_status == 8){
                    // 直接是确认过得订单，再次提交修改为已经发货
                    newOrderStatus = 4;
                }else if(ret.order_type == 2 && ret.order_status == 7){
                    // 如果是询价订单 并且等待报价
                    newOrderStatus = 3;
                }
                else{
                    return res.json({
                        status: 500,
                        msg:'状态错误'
                    })
                }
                conn.query('update ordermaster set order_status='+newOrderStatus+' where order_id="'+order_id+'"', function(err, result){
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
