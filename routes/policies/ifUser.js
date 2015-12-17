module.exports = (req, res, next) => {
  var error = new Error('Unauthorized, login please')
  error.status = 403

  if (!req.user) return req.xhr ? res.status(403).json({error: 'Unauthorized, login please'}) : next(error)
  next()
}
