<template lang="pug">
.content
  .content-left
    .host-container
      hosts
  .content-right
    .term-container
      term
</template>

<script>
export default {
    components: {
        Term: () => import('~/components/Term.vue'),
        Hosts: () => import('~/components/Hosts.vue')
    },
    head() {
        return {
            title: 'UCloud SSH'
        }
    }
}
</script>

<style scoped lang="stylus">
.content
  flex-grow 1
  display flex

  .content-left
    width 250px
    position relative
    overflow-y scroll
    overflow-x hidden

    .host-container
      position absolute
      left 0
      right 0

  .content-right
    flex-grow 1
    background-color #1e1e1e
    padding 10px
    position relative
    display flex

    .term-container
      position relative
      flex-grow 1
      overflow hidden
</style>
