module.exports = {
    router: "/feedback/",
    post: function( req, res, next ) {

        var orderid = req.body.orderid;
        var uid = req.session.uid;
        var feedback  =req.body.feedback;
        if(!uid || !feedback){
            return res.json({
                status: 500,
                err:'错误'
            });
        }
        pool.getConnection(function(err, conn) {
            var sql = "insert into feedback(uid, feedback) values ("+uid+",'"+feedback+"') ";
            var obj = {
                feedback:feedback,
                uid: uid
            }
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({
                    status: 200
                });
            });
            conn.release();
        });

    },
    get: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            var sql = 'select * from feedback order by id asc limit 0,100';
            if(req.query.type == 1){
                sql = 'select * from ad order by id asc';
            }
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json(datas);
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
