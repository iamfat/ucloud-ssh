import express from 'express'
import pty from 'pty.js'
import IO from 'socket.io'
import path from 'path'

const router = express.Router()
const ioPath = '/term/socket.io'

var sshConfig = path.resolve(__dirname, '../sshConfig')

router.io = function(server, sessionStore) {
    var io = IO(server, { path: ioPath })

    io.on('connection', socket => {
        console.log(new Date() + ' Connection accepted.')

        var term = null

        function createTerm(host) {
            if (host === 'console' && process.getuid() === 0) {
                term = pty.spawn('/bin/login', [], {
                    name: 'xterm-color',
                    cols: 80,
                    rows: 25
                })
            } else {
                term = pty.spawn('/usr/bin/ssh', [host, '-F', sshConfig], {
                    name: 'xterm-color',
                    cols: 80,
                    rows: 25
                })
            }

            console.log(
                new Date() + ' PID=' + term.pid + ' STARTED for ' + host
            )
            term.on('data', data => {
                socket.emit('output', data)
            })
            term.on('exit', code => {
                console.log(new Date() + ' PID=' + term.pid + ' ENDED')
            })
        }

        socket.on('term connect', (host, token) => {
            console.log('try to connect with token=' + token)
            sessionStore.get(token, (err, session) => {
                if (err) {
                    // socket.emit('output', err+'\r')
                    console.log('sessionStore get error with token=' + token)
                    return
                }
                if (session.user.token === token) {
                    createTerm(host)
                }
            })
        })

        socket.on('resize', data => {
            term && term.resize(data.col, data.row)
        })

        socket.on('input', data => {
            term && term.write(data)
        })

        socket.on('disconnect', () => {
            term && term.end()
        })
    })
}

export default router
