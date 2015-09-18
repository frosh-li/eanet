var score = 10;
module.exports = {
    router: "/recharge/",
    post: function( req, res, next ) {
        var comp_id = req.body.comp_id;
        var score = parseInt(req.body.score);
        var comp_name = req.body.comp_name;
        if(!comp_id || comp_id < 0){
            return res.json({
                status: 500,
                msg:"参数错误",
                comp_id:comp_id
            })
        };
        if(score <= 0){
            return res.json({
                status: 500,
                msg:"参数错误",
                score:score
            })
        }

        pool.getConnection(function(err, conn) {
            conn.query('update comp_info set score=score+'+score+' where id='+comp_id, function(err, scores){
                if(err){
                    return res.json({status: 500, err: err.message});
                };

                conn.query('insert into recharge(uid, realname, comp_id, comp_name, score) values('+req.session.uid+', "'+req.session.realname+'", '+comp_id+', "'+comp_name+'", '+score+')', function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    return res.json({status: 200, msg: '充值积分成功'});
                })
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
