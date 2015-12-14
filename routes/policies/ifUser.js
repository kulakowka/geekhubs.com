module.exports = function (req, res, next) {
  var error = new Error('Unauthorized')
      error.status = 401
  if (!req.user) return next(error)
  next()
}
