module.exports = function (req, res, next) {
	console.log(req.path);
	if(!req.session.uid && req.path != "/api/user/login") {
		return res.json({status: 302, msg:'please login'});
	}else{
		next()
	}
}
