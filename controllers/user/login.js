
var md5 = require( 'md5' ).digest_s;
module.exports = {
    router: "/login/",
    post: function( req, response, next ) {
        log.debug( 'ok', req.body );
        var username = req.body.username,
            password = md5(req.body.password);
        var ret;
        if ( !username || !password ) {
            ret = {
                status: 500,
                msg: '登录失败'
            };
            log.debug( ret );
            return response.json( ret );
        }

        pool.getConnection(function(err, conn) {
            console.log('mysql 连接成功');

            conn.query('select user.*, role.role_type from user,role where username="'+username+'" and password="'+password+'" and user.role_id=role.id limit 0,1', function(err, datas){
                if(err){
                    return response.json({status: 500, err: err.message});
                }
                if(!datas || datas.length < 1){
                    return response.json({status:500, msg:"用户名或者密码错误"});
                }
                console.log(datas);
                var cdata = datas[0];
                //req.session
                req.session.username = cdata.username;
                req.session.realname = cdata.realname;
                req.session.comp_id = cdata.comp_id;
                req.session.role_id = cdata.role_id;
                req.session.email = cdata.email;
                req.session.role_type = cdata.role_type;

                console.log(req.session);
                var ret = {
                    status: 200,
                    username: req.session.username,
                    realname: req.session.realname,
                    comp_id:req.session.comp_id,
                    role_id: req.session.role_id,
                    email: req.session.email
                };
                response.json(ret);
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
