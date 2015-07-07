module.exports = function (req, res, next) {
  if (process.env.noAuth == 'true') {
        return next();
  }
  var path = req.path.replace("/api","");
  log.debug('path', path);

  if(!req.session.uid && path.indexOf("/ucenter/") !== 0){
        return res.json({
            status: 302,
            msg: "需要登录"
        });
  }
  if (path.indexOf("/ucenter/") !== 0) {
        log.debug('检查权限');
        var ret;
        //return res.json({status: 403, msg:"权限不够"});
        var gotAuth = false;
        var uid = req.session.uid;
        console.log('session uid');
        async.waterfall([
            function(cb){
                models.user.checkLogin(uid).then(function (user) {
                    var auth = user.auth;
                    log.debug('auth', auth);
                    return cb(null, user.group);
                }, function (err) {
                    log.debug('system error', err);
                    return cb(302);
                });
            },
            function(group, cb){
                models.group.getByGroupName(group).then(function(ugroup){
                    var hasAuthed = false;
                    log.info('apilists', ugroup);
                    ugroup.apilist.forEach(function(api){
                        var apiuri = api.url;
                        if(path.toString().indexOf(apiuri) === 0 && (api.method == "*" || api.method.toUpperCase() == req.method.toUpperCase())){
                            hasAuthed = true;
                            return;
                        }
                    });
                    return cb(null, hasAuthed);
                }, function(err){
                    log.debug('system error', err);
                    return cb(err);
                });
            }
        ], function(err, hasAuthed){
            if(err === 302){
                return res.json({
                    status: 302,
                    msg: "需要登录"
                });
            }
            if(err){
                return res.json({
                    status: 301,
                    msg: 'no auth',
                    err: err
                })
            }
            if(hasAuthed){
                next();
            }else{
                return res.json({
                    status: 301,
                    msg: 'no auth'
                })
            }
        });


  } else {
        next();
  }
}