module.exports = function (req, res, next) {
	if(!req.session.id){
		res.json({status: 301, msg:'please login'});
	}
}
