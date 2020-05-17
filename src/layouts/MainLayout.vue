<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn icon="arrow_back" flat v-if="$route.fullPath.includes('/chat')" v-go-back.single />
        <q-toolbar-title class="absolute-center">{{title}}</q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn
          v-if="!userDetails.userId"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Login"
          class="absolute-right q-pr-sm"
          to="/auth"
        />
        <q-btn v-else @click="logoutUser" flat dense class="absolute-right q-pr-sm">
          Log Out
          <br />
          {{userDetails.name}}
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'
export default {
  mixins:[mixinOtherUserDetails],
  
methods:{
  ...mapActions('store',['logoutUser'])
},
  computed: {
    ...mapState("store", ["userDetails"]),
    title() {
      console.log(this.$route);
      let currentPath = this.$route.fullPath;

      if (currentPath == "/") {
        return "Chat Application";
      } else if (currentPath == "/auth") {
        return "Authorization";
      } else if (currentPath.includes( "/chat")) {
        return this.otherUserDetails.name;
      }
    }
  },

  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>
<style lang="stylus">
.q-toolbar {
  .q-btn {
    line-height: 1.2;
  }
}
</style>