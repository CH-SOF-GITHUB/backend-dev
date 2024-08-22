const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const roleArray = [...roles]

    if (!roleArray.includes(req.user.role)) {
      return res.status(401).json({ message: false, error: 'non autorisé !' })
    }
    next()
  }
}

module.exports = authorizeRoles;