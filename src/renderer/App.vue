<template>
  <div id="app">
    <cloud-music-window/>
  </div>
</template>

<script>
  import CloudMusicWindow from '@/views/Window.vue'

  import {
    login_refresh,
    login_status,
  } from "@/network/request_login";
  import { playlist, likelist } from "@/network/request_uesr";
  import StoreTypes from "@/store/types";
  import BusTypes from "@/utils/bus/types"

  export default {
    components: { CloudMusicWindow },

    mounted() {
      //进入时 检查登录状态并获取用户信息

      // return

      let isLogin = window.localStorage.getItem("isLogin")
      let profile = window.localStorage.getItem("profile")

      if (!isLogin) {
        this.$store.commit(StoreTypes.UPDATE_LOGIN_STATUS, {
          isLogin: false,
          profile: null
        })
      } else {
        profile = JSON.parse(profile)
        this.$store.commit(StoreTypes.UPDATE_LOGIN_STATUS, { isLogin, profile })
        this.$bus.$emit(BusTypes.USER_LOGIN)
      }
    },
  


    created() {

      this.$bus.$on(BusTypes.USER_LOGIN, () => {
        this.initInfo()
      })

      this.$bus.$on(BusTypes.PLACE_LOGIN, () => {
        this.$notify.warning({
          title: '请先登录',
          message: `还未登录，登录后才可使用此功能`
        })
        this.$bus.$emit(BusTypes.LOGIN_PANEL_CUTOVER)
      })
    },

    methods: {

      initInfo() {
        let uid = this.$store.state.profile.UID
        playlist(uid).then(result => {
          this.$store.commit(StoreTypes.COLL_PLAYLIST, {
            track: result['playlist'].filter((value) => value['subscribed'])
          })

          this.$store.commit(StoreTypes.PLAYLIST, {
            track: result['playlist'].filter(value => !value['subscribed'])
          })
        })

        likelist(uid).then(result => {
          this.$store.commit(StoreTypes.LIKED_SONG, { track: result['ids'] })
        })
      }
    }
  }
</script>

<style>
  @import "assets/css/base.css";

  body, html, #app {
    height: 100%;
    width: 100%;
  }
</style>
