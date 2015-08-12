var JPush = require('jpush-sdk');
var client = JPush.buildClient('1b7ee4b42a31e5897dd7ab42','384264e442cec348ebdac2a5');
module.exports = {
    router: "/push/",
    post: function( req, res, next ) {
        pool.getConnection(function(err, conn) {
            req.body.comp_id = req.session.comp_id;
            req.body.uid = req.session.uid;
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
