import { expressjwt } from 'express-jwt'

const jwtAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

const jwtAuthError = async (err, req, res, next) => {
  if (err.name === 'UnauthorizedError')
    res.status(401).send('invalid token...')
  else
    next(err)
}

export { jwtAuth, jwtAuthError }
