module.exports = {
    router: "/print/",
    post: function( req, res, next ) {
        next();
    },
    get: function( req, res, next ) {
        var limit = parseInt(req.query.count) || 10;
        var page = parseInt(req.query.page) || 1;
        var start = (page-1)*limit;
        var order_id = req.query.order_id;
        pool.getConnection(function(err, conn) {
            var csql = 'select orderdetail.*,good_info.* from orderdetail,good_info where orderdetail.good_reject > 0 and good_info.good_id=orderdetail.good_id and orderdetail.order_id="'+order_id+'"';
            console.log(csql);
            conn.query(csql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                console.log(datas);

                res.render('view',{result:datas, username:req.session.username});
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
