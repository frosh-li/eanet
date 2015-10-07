module.exports = {
    router: "/noitem/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        var limit = parseInt(req.query.count) || 10;
        var page = parseInt(req.query.page) || 1;
        var start = (page-1)*limit;
        var sqlCount = "select count(*) as total from orderdetail where order_id in (select order_id from ordermaster where order_reject = 1 and comp_id="+req.session.comp_id+") and good_missing > 0";
        var sql = "select orderdetail.*, ordermaster.supplie_id,comp_info.name from orderdetail,ordermaster,comp_info where orderdetail.order_id=ordermaster.order_id and ordermaster.supplie_id=comp_info.id and orderdetail.order_id in (select order_id from ordermaster where order_reject = 1 and comp_id="+req.session.comp_id+") and good_missing > 0";
        new Promise(function(resolve, reject){
            pool.getConnection(function(err, conn) {
                if(err){
                    return reject(err);
                }
                resolve(conn);
            });
        }).then(function(conn){
            return new Promise(function(resolve, reject){
                conn.query(sqlCount, function(err, ret){
                    if(err){
                        return reject(err);
                    }
                    console.log(ret);
                    resolve({conn: conn, ret: ret});
                });
            });
        }).then(function(data){
            console.log(data);
            var conn = data.conn;
            var ret = data.ret;
            conn.query(sql+' limit '+start+','+limit, function(err, datas){
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
