// run only on server-side
import sha1 from 'sha1'
import axios from './axios'
import config from '../ucloud.config'

function getSignature(params) {
    var keys = Object.keys(params)
    var str=''
    keys.sort().forEach((key)=>{
        str += key + params[key]
    })
    str += config.privateKey
    return sha1(str)
}

var UCloud = new Proxy({}, {
    get (target, action) {
        return function (params) {
            params.PublicKey = config.publicKey
            params.Action = action
            // params.ProjectId = projectId
            params.Signature = getSignature(params)
            const e = encodeURIComponent
            let url = config.apiBase + '?' + 
                Object.keys(params).map(k => e(k) + '=' + e(params[k])).join('&')
            return new Promise((resolve, reject) => {
                axios.get(url).then(({ data }) => {
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
})

export default UCloud
