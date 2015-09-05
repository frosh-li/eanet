var JPush = require('jpush-sdk');
var client = JPush.buildClient('1b7ee4b42a31e5897dd7ab42','384264e442cec348ebdac2a5');
module.exports = {
    router: "/push/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            req.body.comp_id = req.session.comp_id;
            req.body.uid = req.session.uid;
            conn.query('select * from config', function(err, configs){
                if(err){
                    conn.release();
                    return res.json({status: 500, err: err.message});
                }
                if(!configs || configs.length < 1){
                    conn.release();
                    return res.json({status: 500, err: '缺少推送配置'});
                }
                var config = {};
                configs.forEach(function(item){
                    config[item.key] = item.value;
                });
                conn.query('select * from push where month(create_date)=month(now()) and comp_id='+req.body.comp_id, function(err, pushed){
                    if(err){
                        conn.release();
                        return res.json({status: 500, err: err.message});
                    }
                    var todayCount = 0;
                    pushed.forEach(function(item){
                        if(new Date(item.create_date).setHours(0,0,0,0) == new Date().setHours(0,0,0,0)){
                            todayCount ++;
                        }
                    });
                    if(todayCount >= config.daily){
                        conn.release();
                        return res.json({status:500,msg:'超出日发送限额，今天已发送'+todayCount+'条'});
                    }
                    if(pushed.length >= config.month){
                        conn.release();
                        return res.json({status:500,msg:'超出月发送限额，当月已发送'+todayCount+'条'});
                    }
                    var needScore = 0;
                    if(pushed.length >= config.freecount && pushed.length < config.step_1){
                        needScore = config.step_1_score;
                    }else if(pushed.length >= config.step_1){
                        needScore = config.step_2_score;
                    }
                    conn.query('update comp_info set score=score-'+needScore+' where id='+req.session.comp_id+' and score >= '+needScore, function(err,updateScore){
                        if(err){
                            conn.release();
                            return res.json({status: 500, err: '积分不够，请先充值'});
                        }
                        conn.query('insert into push set ?',req.body, function(err, datas){
                            if(err){
                                return res.json({status: 500, err: err.message});
                            }
                            var insertid = datas.insertId;
                            // start push
                            client.push().setPlatform(JPush.ALL)
                            .setAudience(JPush.ALL)
                            .setNotification(req.body.title)
                            .setMessage(req.body.msg)
                            .setOptions(null, null, null, true)
                            .send(function(err, push_res) {
                                if (err) {
                                    console.log(err.message);
                                } else {

                                    console.log('Sendno: ' + push_res.sendno);
                                    console.log('Msg_id: ' + push_res.msg_id);
                                    (function(msg_id){
                                        setTimeout(function(){
                                            client.getReportReceiveds(msg_id.toString(), function(err, reportRes){
                                                if(err){
                                                    console.log('err.message');
                                                }else{
                                                    console.log('report',reportRes);
                                                    if(!reportRes || reportRes.length < 0){
                                                        return;
                                                    }
                                                    var ios = reportRes[0].ios_apns_sent || 0;
                                                    var android = reportRes[0].android_received || 0;
                                                    var pushed = {
                                                        ios: ios,
                                                        android:android
                                                    };
                                                    conn.query('update push set ? where id='+insertid, pushed, function(){
                                                        if(err){
                                                            console.log('err', err.message);
                                                        }
                                                    });
                                                }
                                            });
                                        },5000);
                                    })(push_res.msg_id);


                                }
                            });
                            res.json({status: 200, data: datas});
                        });
                        conn.release();
                    });

                });
            });

        });
    },
    get: function( req, res, next ) {
        var code = req.params.id;
        if ( code ) {
            console.log(code);
            res.json({status:600});
        } else {
            log.info( 'api list' );
            pool.getConnection(function(err, conn) {
                var sql = 'select push.*, user.username from push, user where user.id=push.uid and push.comp_id='+req.session.comp_id+' order by create_date desc limit 0,30';
                if(req.session.role_type == 2){
                    sql = 'select push.*, user.username, comp_info.name from push, user, comp_info where comp_info.id=push.comp_id and user.id=push.uid order by create_date desc limit 0,30';
                }
                console.log(sql);
                conn.query(sql, function(err, datas){
                    if(err){
                        return res.json({status: 500, err: err.message});
                    }
                    res.json(datas);
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
        var code = req.params.id;
        if ( !code ) {
            res.json( {
                status: 500,
                msg: "参数缺失:code"
            } );
            return;
        }
        var sql = 'delete from push where id='+code;
        console.log(sql);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, datas){
                if(err){
                    return res.json({status: 500, err: err.message});
                }
                res.json({status: 200, data: datas});
            });
            conn.release();
        });
    },
    all: function( req, res, next ) {
        next();
    }
};
