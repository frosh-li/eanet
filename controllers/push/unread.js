var JPush = require('jpush-sdk');
var client = JPush.buildClient('1b7ee4b42a31e5897dd7ab42','384264e442cec348ebdac2a5');
module.exports = {
    router: "/read/",
    post: function( req, res, next ) {

        var id = req.body.id;

        if(!id){
            return res.json({status: 500, msg:'参数错误', key:key, val:val})
        }

        var cxMsg = req.session.cxMsg;
        if(!cxMsg[id]){
            cxMsg[id] = true;
        }
        req.session.cxMsg = cxMsg;

        var sql = 'update user set cxMsg=\''+JSON.stringify(cxMsg)+'\' where id='+req.session.uid;

        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err){
                if(err){
                    return res.json({status: 500, err: err.message});
                };
                return res.json({
                    status: 200
                });

            })
            conn.release();
        });
    },
    get: function( req, res, next ) {
        next()
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
