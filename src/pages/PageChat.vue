<template>
  <q-page ref="pageChat" class="page-chat flex column">
    <q-banner
      v-if="!otherUserDetails.online"
      class="text-center bg-grey-4 fixed-top"
    >{{otherUserDetails.name}} is Offline</q-banner>
    <div :class="{ 'invisible' : !showMessages }" class="q-pa-md column col justify-end">
      <q-chat-message
        v-for=" (message,key) in messages"
        :key="key"
        :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
        :bg-color="message.from == 'me' ? 'accent' : 'trial'"
        text-color='white'
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form class="full-width" @submit="sendMessage">
          <q-input
            bg-color="white"
            outlined
            rounded
            v-model="newMessage"
            dense
            required
            placeholder="Message"
          >
            <template v-slot:after>
              <q-btn round dense flat color="white" icon="send" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinOtherUserDetails from "src/mixins/mixin-other-user-details.js";
export default {
  mixins: [mixinOtherUserDetails],
  data() {
    return {
      newMessage: "",
      showMessages: false
    };
  },
  computed: {
    ...mapState("store", ["messages", "userDetails"])
  },
  methods: {
    ...mapActions("store", [
      "firebaseGetMessages",
      "firebaseStopGettingMessages",
      "firebaseSendMessage"
    ]),
    sendMessage() {
      console.log("data came " + this.newMessage);

      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: "me"
        },
        otherUserId: this.$route.params.id
      });
      this.newMessage = "";
    },

    scrollToBottom() {
      let pageChat = this.$refs.pageChat.$el;
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    }
  },
  watch: {
    messages: function(val) {
      if (Object.keys(val).length) {
        this.scrollToBottom();
        // setTimeout(() => {
        //   }, 20);
        this.showMessages = true;
      }
    }
  },
  mounted() {
    this.firebaseGetMessages(this.$route.params.id);
  },
  destroyed() {
    this.firebaseStopGettingMessages();
  }
};
</script>

<style lang="stylus">
.page-chat 
  background #e2dfd5;

  &:after 
    content ''
    display block
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 0
    opacity 0.1
    background-image radial-gradient(circle at 100% 150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 0    150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 50%  100%, white 10%, silver 10%, silver 23%, white 23%, white 30%, silver 30%, silver 43%, white 43%, white 50%, silver 50%, silver 63%, white 63%, white 71%, transparent 71%, transparent), radial-gradient(circle at 100% 50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent), radial-gradient(circle at 0    50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent);
    background-size: 100px 50px;

.q-message
  z-index 1

.q-message-text:last-child
  min-height 0

.q-banner
  top 50px
  z-index 2
  opacity 1
</style>