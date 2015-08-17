var md5 = require('md5').digest_s;
var fs = require('fs');
module.exports = {
    router: "/getVersion/",
    post: function( req, res, next ) {
        var version = req.body.version;
        if(!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)){
            return res.json({
                status: 500,
                msg:'参数错误',
                version: version
            })
        }
        fs.writeFile('version', version, function(err, ret){
            if(err){
                return res.json({
                    status: 500,
                    msg:'写入信息错误',
                    version:version
                })
            }
            return res.json({
                status: 200
            })
        });
    },
    get: function( req, res, next ) {
        fs.readFile('version', function(err, data){
            if(err){
                return res.json({status: 500, msg:"未知错误信息"});
            }
            res.json({
                'status': 200,
                'version':data.toString()
            });
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
