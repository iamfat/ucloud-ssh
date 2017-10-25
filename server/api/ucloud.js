import { Router } from 'express'
import UCloud from '../../plugins/ucloud'

const router = Router()

router.use('/', function(req, res, next) {
    if (!req.session.user) {
        res.sendStatus(401)
    } else {
        next()
    }
})

var projects = null
var projectHosts = {}

router.get('/projects', function(req, res, next) {
    if (projects) {
        res.json(projects)
        return
    }

    UCloud.GetProjectList({ ResourceCount: true, MemberCount: true })
        .then(({ data }) => {
            if (data.RetCode !== 0) {
                res.status(data.RetCode).send(data.Message)
                return
            }
            projects = {}
            data.ProjectSet.forEach(rp => {
                projects[rp.ProjectId] = {
                    id: rp.ProjectId,
                    name: rp.ProjectName,
                    resourceCount: rp.ResourceCount,
                    memberCount: rp.MemberCount
                }
            })
            res.json(projects)
        })
        .catch(e => {
            res.sendStatus(444)
        })
})

router.get('/hosts', function(req, res, next) {
    if (projectHosts[req.query.project_id]) {
        res.json(projectHosts[req.query.project_id])
        return
    }

    UCloud
        .DescribeUHostInstance({
            Region: 'cn-bj2',
            ProjectId: req.query.project_id,
            Offset: 0,
            Limit: 100
        })
        .then(({ data }) => {
            if (data.RetCode !== 0) {
                res.status(data.RetCode).send(data.Message)
                return
            }
            var hosts = {}
            data.UHostSet.map(host => {
                hosts[host.UHostId] = {
                    id: host.UHostId,
                    name: host.Name,
                    ip: host.IPSet[0].IP,
                    zone: host.Zone,
                    tag: host.Tag,
                    state: host.State
                }
            })
            projectHosts[req.query.project_id] = hosts
            res.json(hosts)
        })
        .catch(e => {
            res.sendStatus(444)
        })
})

export default router
