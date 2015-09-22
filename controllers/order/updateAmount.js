
module.exports = {
    router: "/updateAmount/",
    post: function( req, res, next ) {
        console.log(req.body);
        var orderid = req.body.order_id;
        var oid = req.body.oid;
        var number = parseInt(req.body.number);
        if(!number || number < 0){
            return res.json({
                status: 500,
                msg:'请输入正确数值',
                orderid:orderid,
                number:number,
                oid:oid
            })
        }
        var sql = 'update orderdetail set good_number='+number+' where oid='+oid;

        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, data){
                if(err){
                    return res.json({
                        status: 500,
                        msg:err.message
                    })
                }
                return res.json({status: 200})
            })
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
