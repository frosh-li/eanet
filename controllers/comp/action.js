// var score = 10;
var fs = require('fs');
module.exports = {
    router: "/action/",
    post: function( req, res, next ) {
        var id = req.body.id;
        if(!id){
            return res.json({
                status: 500,
                msg:"参数错误",
                id:id
            })
        };
        var score_config = JSON.parse(fs.readFileSync('score.config').toString('utf-8').replace(/[\n\t]/g,''));
        var score = score_config.remove_score_on_kaihu;
        console.log('score config', score_config);
        if(req.body.action != 'accept' && req.body.action != 'reject'){
            return res.json({
                status:500,
                msg:'参数错误',
                id:id,
                action:req.body.action
            })
        }
        var status = 1;
        if(req.body.action == 'accept'){
            status = 2;
        }
        pool.getConnection(function(err, conn) {
            conn.query('select score from comp_info where id='+req.session.comp_id, function(err, scores){
                if(err){
                    return res.json({status: 500, err: err.message});
                };
                if(!scores || scores.length < 1){
                    return res.json({status: 500, err: '积分查询不到'});
                }
                var cScore = scores[0].score;
                console.log(cScore);
                if(cScore < score){
                    return res.json({status: 500, err: '积分不够，请先联系客服充值积分'});
                }
                conn.query('update comp_map set status='+status+' where comp_id_1='+req.session.comp_id+' and comp_id_2='+id, function(err,datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    // 增加药店积分
                    conn.query('update comp_info set score=score+'+score_config.add_score_on_kaihu+' where id='+id, function(err){
                        if(err){
                            console.log(err.message);
                            return;// res.json({status: 500, err: err.message});
                        }
                        return;
                    });

                    //减药店企业积分
                    conn.query('update comp_info set score=score-'+score+' where id='+req.session.comp_id, function(err){
                        if(err){
                            return res.json({status: 500, err: err.message});
                        }
                        return res.json({
                            status: 200
                        });
                    })

                    conn.release();
                });
            });


        });
    },
    get: function( req, res, next ) {
        var id = req.params.id;
        var key = req.query.upkey;
        var val = req.query.upval;
        console.log(req.query, req.params);
        if(!id || !key || !val){
            return res.json({status: 500, msg:'参数错误', id:id})
        }
        var obj = key+'="'+val+'"';
        var sql = 'update comp_map set '+obj+' where comp_id_1='+req.session.comp_id+" and comp_id_2="+id;

        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, scores){
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
