import { Router } from 'express'

const router = Router()

router.post('/login', function(req, res, next) {
    var data = {
        username: req.body.username,
        token: req.session.id
    }
    req.session.user = data
    res.json(data)
    // res.sendStatus(error.response.status)
})

router.post('/logout', function(req, res, next) {
    delete req.session.user
    res.json(true)
})

router.get('/status', function(req, res, next) {
    var user = req.session.user
    if (user) {
        res.json(user)
    } else {
        res.sendStatus(401)
    }
})

export default router
