var path = require('path');
var fs = require('fs');
var parseXlsx = require('excel');

module.exports = {
    router: "/multiOrders/",
    post: function( req, res, next ) {
        console.log('session');
        console.log(req.session);
        var orderid = req.body.orderid;
        var data = _.pick(req.body, 'type')
            , uploadPath = path.normalize('./uploads')
            , file = req.files.file;

            console.log(file.name); //original name (ie: sunset.png)
            console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
            console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
            parseXlsx(file.path, function(err, data) {
                if(err) {
                    res.json({
                        status: 500,
                        msg: err.message
                    });
                    return;
                };

                var inserts = [];

                var sql = "insert into orderdetail(order_id, good_id, good_number,good_price, good_amount, good_name,good_gg,good_dw, good_cp, good_pzwh) values";

                pool.getConnection(function(err, connection) {
                    if(err){
                        return res.json({
                            status: 500,
                            msg: err.message
                        });
                    }

                    for(var i = 1 ; i < data.length; i++){
                        var item = data[i];
                        inserts.push(
                            "('"+orderid+"'",
                            parseInt(item[0]),
                            parseInt(item[6]) || 0,
                            parseInt(item[7]) || 0 ,
                            parseInt(item[8]) ||0,
                            "'" +item[1]+"'",
                            "'" +item[2]+"'",
                            "'" +item[3]+"'",
                            "'" +item[4]+"'",
                            "'" +item[5]+"')"
                        );
                    }
                    sql += inserts.join(',');
                    console.log('sql',sql);
                    connection.query(sql, function(err, result){
                        if(err){
                            return res.json({
                                status: 500,
                                msg: err.message
                            });
                        }
                        res.json({
                            status: 200
                        })
                    });
                        // 进行批量操作
                    fs.unlink(file.path);
                    connection.release();
                });

            });
    },
    get: function( req, res, next ) {


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
