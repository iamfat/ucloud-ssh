// run only on server-side
import sha1 from 'sha1'
import axios from './axios'
import config from './config'

function getSignature(params) {
    params.PublicKey = config.publicKey

    var str = ''
    var keys = Object.keys(params)
    keys.sort().forEach(key => {
        str += key + params[key]
    })
    str += config.privateKey

    return sha1(str)
}

export default new Proxy(
    {},
    {
        get(target, action) {
            return async params => {
                params.Action = action
                params.Signature = getSignature(params)
                const e = encodeURIComponent
                let url =
                    config.apiBase +
                    '?' +
                    Object.keys(params)
                        .map(k => e(k) + '=' + e(params[k]))
                        .join('&')
                let { data } = await axios.get(url)
                return data
            }
        }
    }
)
