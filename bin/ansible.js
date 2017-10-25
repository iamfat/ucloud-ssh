import UCloud from '../plugins/ucloud'

async function fetchHosts() {
    var projects = {}
    var projectHosts = {}

    let respProjects = await UCloud.GetProjectList({
        ResourceCount: true,
        MemberCount: true
    })
    if (respProjects.RetCode !== 0) {
        console.log(respProjects.RetCode + ': ' + respProjects.Message)
    }

    for (var idx in respProjects.ProjectSet) {
        var rp = respProjects.ProjectSet[idx]
        projects[rp.ProjectId] = {
            id: rp.ProjectId,
            name: rp.ProjectName
        }

        let respHosts = await UCloud.DescribeUHostInstance({
            Region: 'cn-bj2',
            ProjectId: rp.ProjectId,
            Offset: 0,
            Limit: 100
        })

        if (respHosts.RetCode === 0) {
            var hosts = {}
            respHosts.UHostSet.map(host => {
                hosts[host.UHostId] = {
                    id: host.UHostId,
                    name: host.Name,
                    ip: host.IPSet[0].IP,
                    zone: host.Zone,
                    tag: host.Tag,
                    state: host.State
                }
            })
            projectHosts[rp.ProjectId] = hosts
        }
    }

    return {projects, projectHosts}
}


fetchHosts().then(({projects, projectHosts}) => {
    for (var id in projects) {
        console.log('[' + projects[id].name + ']')
        var hosts = projectHosts[id]
        for (var hid in hosts) {
            var host = hosts[hid]
            console.log(host.name + '\tansible_ssh_host=' + host.ip)
        }
        console.log('')
    }
}).catch(e => {
    console.log(e)
})