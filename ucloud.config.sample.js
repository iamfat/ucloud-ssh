module.exports = {
    publicKey: process.env.UCLOUD_PUBLIC_KEY,
    privateKey: process.env.UCLOUD_PRIVATE_KEY,
    apiBase: process.env.UCLOUD_API_BASE || 'https://api.ucloud.cn',
    gapperBase: process.env.UCLOUD_GAPPER_BASE || 'http://gapper.in',
    allowedUsers: {
        // '@project': ['user1', 'user2']
        // 'host': ['user3']
        // '*': ['user4']
    }
}
