export default {
  computed: {
    otherUserDetails() {
      if (this.$store.state.store.users[this.$route.params.id]) {

        return this.$store.state.store.users[this.$route.params.id];
      } else {
        return {}
      }
    }
  }
}
