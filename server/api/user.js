import { Router } from 'express'
import crypto from 'crypto'
import axios from '../../plugins/axios'

const router = Router()

async function auth(username, password) {
    const config = require('../../ucloud.config')
    let url = config.gapperBase + '/api/v1/auth/verify'
    const e = encodeURIComponent
    let { data } = await axios.get(
        url + '?username=' + e(username) + '&password=' + e(password)
    )
    return data
}

router.post('/login', function(req, res, next) {
    auth(req.body.username, req.body.password)
        .then(data => {
            req.session.user = data
            res.json({
                username: data.username,
                token: req.session.id
            })
        })
        .catch(e => {
            console.log(e)
            res.sendStatus(401)
        })
    // res.sendStatus(error.response.status)
})

router.post('/logout', function(req, res, next) {
    req.session.destroy()
    res.json(true)
})

router.get('/status', function(req, res, next) {
    var user = req.session.user
    if (user) {
        res.json({
            username: user.username,
            token: req.session.id
        })
    } else {
        res.sendStatus(401)
    }
})

export default router
