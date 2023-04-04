import { expressjwt } from 'express-jwt'

const jwtAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

const jwtAuthError = async (err, req, res, next) => {
  if (err.name === 'UnauthorizedError')
    res.status(200).send({ status: 'Unauthorized', message: err.name, data: null })
  else
    next(err)
}

export { jwtAuth, jwtAuthError }
