function multi(conn, sqls, res, orderid){
    var sql = sqls.shift();
    if(!sql){
        conn.query('update ordermaster set order_status=3 where order_id="'+orderid+'"', function(err){
            if(err){
                return res.json({status: 500, err: err.message});
            }
            return res.json({
                status: 200
            });
            conn.release();
        });

    }
    conn.query(sql, function(err, ret){
        if(err){
            return res.json({status: 500, err: err.message});
        }
        multi(conn,sqls, res, orderid);
    });
}
module.exports = {
    router: "/autoprice/",
    post: function( req, res, next ) {
        console.log(req.body);
        var sql = 'update orderdetail set good_price={{price}}, good_amount={{good_amount}} where oid={{oid}}';
        var querys = [];
        var oid = req.body.oid.split("|"),
            price = req.body.price.split("|"),
            amount = req.body.amount.split("|");
        var orderid = req.body.orderid;
        oid.forEach(function(o, index){
            querys.push(sql.replace('{{price}}', price[index]).replace('{{oid}}', o).replace('{{good_amount}}', amount[index]));
        });

        console.log(querys);
        pool.getConnection(function(err, conn) {
            multi(conn, querys, res,orderid);

        });
        // next();
    },
    get: function( req, res, next ) {

        var code = req.params.id;
        if ( !code ) {
            console.log(code);
            res.json({status:600});
        } else {
            var orderid = code;
            var sql = "select good_id,good_price as price from good_info where good_company in (select supplie_id from ordermaster where order_id = '"+orderid+"') and good_id in (select good_id from orderdetail where order_id = '"+orderid+"');";
            pool.getConnection(function(err, conn) {
                conn.query(sql, function(err, ret){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json({
                        status: 200,
                        data: ret
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
        next();
    },
    all: function( req, res, next ) {
        next();
    }
};
