
var md5 = require( 'md5' ).digest_s;
module.exports = {
    router: "/changepass/",
    post: function( req, response, next ) {

        var oldpass = req.body.oldpass,
            password = md5(req.body.password);
        var ret;
        if ( !oldpass || !password ) {
            ret = {
                status: 500,
                msg: '登录失败'
            };
            log.debug( ret );
            return response.json( ret );
        }
        if(req.body.password.length < 6){
            return response.json({
                status: 500,
                msg:"密码长度需要大于6位"
            })
        }

        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');

            conn.query('select * from user where id='+req.session.uid+' and password="'+md5(oldpass)+'" limit 0,1', function(err, datas){
                if(err){
                    return response.json({status: 500, err: err.message});
                }
                if(!datas || datas.length < 1){
                    return response.json({status:500, msg:"修改密码失败,旧密码不对"});
                }
                console.log(datas);
                var cdata = datas[0];
                if(cdata.status === 1){
                    response.json({
                        status: 500,
                        msg:"账号已停用"
                    });
                }
                console.log('new pass', password, md5(password));
                conn.query('update user set password="'+password+'" where id='+req.session.uid, function(err,u){
                    if(err){
                        return response.json({status: 500, msg: err.message});
                    }
                    return response.json({
                        status:200,
                        msg:'密码修改成功'
                    })
                });
                //response.json(ret);
                conn.release();
            });

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
