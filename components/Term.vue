<template lang="pug">
#term
</template>

<script>
import {hterm, lib} from 'hterm-umdjs'
import io from 'socket.io-client'
import { mapState } from 'vuex'

export default {
  data: () =>({
      socket: null,
      term: null
  }),
  computed: mapState({
      host: state => state.term.host,
      token: state => state.user.me.token
  }),
  watch: {
      host (host) {
          var $term = document.getElementById('term')
          var token = this.token
          $term.focus()
          this.term.clearHome()
          this.socket.emit('term connect', host == 'console' ? host : host.ip, token)
      }
  },
  mounted () {
    var term
    var socket = io(location.origin, {path: '/term/socket.io'})
    var buf = ''

    this.socket = socket

    function TermClass(argv) {
        this.argv_ = argv
        this.io = null
        this.pid_ = -1
    }

    TermClass.prototype.run = function() {
        this.io = this.argv_.io.push()
        this.io.onVTKeystroke = this.sendString_.bind(this)
        this.io.sendString = this.sendString_.bind(this)
        this.io.onTerminalResize = this.onTerminalResize.bind(this)
    }

    TermClass.prototype.sendString_ = function (str) {
        socket.emit('input', str)
    }

    TermClass.prototype.onTerminalResize = function (col, row) {
        socket.emit('resize', { col: col, row: row })
    }

    socket.on('connect', () => {
        lib.init(() => {
            hterm.defaultStorage = new lib.Storage.Local()
            this.term = term = new hterm.Terminal()
            term.decorate(document.getElementById('term'))

            term.setCursorPosition(0, 0)
            term.setCursorVisible(true)

            term.prefs_.set('user-css', '//cdn.jsdelivr.net/font-hack/2.019/css/hack-extended.min.css')
            term.prefs_.set('font-family', '"Hack",monospace')
            term.prefs_.set('background-color', '#1e1e1e')
            term.prefs_.set('ctrl-c-copy', true)
            term.prefs_.set('ctrl-v-paste', true)
            term.prefs_.set('use-default-window-copy', true)

            term.runCommandClass(TermClass, document.location.hash.substr(1))
            socket.emit('resize', {
                col: term.screenSize.width,
                row: term.screenSize.height
            })

            if (buf && buf != '')
            {
                term.io.writeUTF16(buf)
                buf = ''
            }
        })
    })

    socket.on('output', (data) => {
        if (!term) {
            buf += data
            return
        }
        term.io.writeUTF16(data)
    })

    socket.on('disconnect', function() {
        console.log("Socket.io connection closed")
    })

  }
}
</script>

<style scoped lang="stylus">
#term
  width 100%
  height 100%
</style>