function multi(conn, sqls, res, orderid){
    var sql = sqls.shift();
    if(!sql){
        var date = new Date();
        var rejectDate = date.getFullYear()+""
                        + (date.getMonth()+1 < 10 ? ("0"+(date.getMonth()+1).toString()):(date.getMonth()+1).toString())
                        + (date.getDate() < 10 ? ("0"+(date.getDate()).toString()):(date.getDate()).toString());
        var csql = 'update ordermaster set order_lastvaiddate="'+rejectDate+'" , order_reject=1 where order_id="'+orderid+'"'
        console.log('reject item ', csql);
        conn.query(csql, function(err){
            if(err){
                return res.json({status: 500, err: err.message});
            }
            return res.json({
                status: 200
            });
            conn.release();
        });

    }else{
        conn.query(sql, function(err, ret){
            if(err){
                return res.json({status: 500, err: err.message});
            }
            multi(conn,sqls, res, orderid);
        });
    }

}
module.exports = {
    router: "/rejectItems/",
    post: function( req, res, next ) {
        console.log(req.body);
        var sql = 'update orderdetail set good_reject={{good_reject}},reject_reason={{reject_reason}} where oid={{oid}}';
        var querys = [];
        var oid = req.body.oid.split("|"),
            good_reject = req.body.good_reject.split("|"),
            reject_reason = req.body.reject_reason.split("|");
        var orderid = req.body.orderid;
        oid.forEach(function(o, index){
            querys.push(sql.replace('{{good_reject}}', good_reject[index]).replace('{{oid}}', o)).replace('{{reject_reason}}', reject_reason[index]);
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
