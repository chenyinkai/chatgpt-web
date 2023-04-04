import axios from 'axios'
import qs from 'qs'
import jwt from 'jsonwebtoken'
import express from 'express'

export const userRouter = express.Router()

userRouter.get('/openid', async (req, res) => {
  try {
    res.redirect(process.env.OPENID_REDIRECT_URL)
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

userRouter.get('/code', async (req, res) => {
  try {
    const { code, error, error_description } = req.query
    if (!code || error) {
      res.send({ status: 'Fail', message: error_description, data: null })
      return
    }
    const response = await axios({
      method: 'post',
      url: process.env.OPENID_CONNECT_TOKEN_URL,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: encodeURIComponent(process.env.OPENID_CALLBACK_URL),
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
    })
    const userinfoRes = await axios({
      method: 'get',
      url: process.env.OPENID_CONNECT_USERINFO_URL,
      headers: {
        authorization: `Bearer ${response.data.access_token}`,
      },
    })
    const payload = { email: userinfoRes.data.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5d',
    })
    res.redirect(`${process.env.DOMAIN}?token=${token}`)
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
