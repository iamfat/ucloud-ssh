import { Router } from 'express'

import user from './user'
import ucloud from './ucloud'

var router = Router()

router.use('/user', user)
router.use('/ucloud', ucloud)

export default router
