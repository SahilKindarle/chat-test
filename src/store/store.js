import Vue from 'vue'
import {
  firebaseAuth,
  firebaseDb
} from 'boot/firebase'

let messagesRef

const state = {
  userDetails: {},
  users: {},
  messages: {}
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload
  },
  addUser(state, payload) {
    Vue.set(state.users, payload.userId, payload.userDetails)
  },
  updateUser(state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails)
  },
  addMessage(state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails)
  },
  clearMessages(state) {
    state.messages = {}
  }
}

const actions = {
  registerUser({}, payload) {
    console.log('Payload: ', payload)
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password).then(response => {
        console.log(response)
        let userId = firebaseAuth.currentUser.uid
        firebaseDb.ref('users/' + userId).set({
          name: payload.name,
          email: payload.email,
          online: true
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  loginUser({}, payload) {
    console.log(payload)
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password).then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  },


  logoutUser() {
    firebaseAuth.signOut()
  },



  handleAuthStateChanged({
    commit,
    dispatch
  }) {
    console.log('handleAuthStateChanged')
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        let userId = firebaseAuth.currentUser.uid
        firebaseDb.ref('users/' + userId).once('value', snapshot => {
          console.log(snapshot);
          let userDetails = snapshot.val();
          console.log(userDetails)
          commit('setUserDetails', {
            name: userDetails.name,
            email: userDetails.email,
            userId: userId
          })
        })
        dispatch('firebaseUpdateUser', {
          userId: userId,
          updates: {
            online: true
          }
        })

        dispatch('firebaseGetUsers')
        this.$router.push('/')
      } else {
        //   signed out
        dispatch('firebaseUpdateUser', {
          userId: state.userDetails.userId,
          updates: {
            online: false
          }
        })
        commit('setUserDetails', {})
        this.$router.replace('/auth')
      }
    });
  },

  firebaseUpdateUser({}, payload) {
    console.log('lolp: ' + payload)
    firebaseDb.ref('users/' + payload.userId).update(payload.updates)
  },

  firebaseGetUsers({
    commit
  }) {
    firebaseDb.ref('users').on('child_added', snapshot => {
      let userDetails = snapshot.val()
      let userId = snapshot.key
      commit('addUser', {
        userId,
        userDetails
      })
    })
    firebaseDb.ref('users').on('child_changed', snapshot => {
      let userDetails = snapshot.val()
      let userId = snapshot.key
      commit('updateUser', {
        userId,
        userDetails
      })
    })
  },

  firebaseGetMessages({
    commit,
    state
  }, id) {
    console.log('id: ' + id)
    console.log("getting msgs")
    let userId = state.userDetails.userId
    messagesRef = firebaseDb.ref('chats/' + userId + '/' + id)
    messagesRef.on('child_added', snapshot => {
      let messageDetails = snapshot.val()
      let messageId = snapshot.key
      commit('addMessage', {
        messageId,
        messageDetails
      })
    })
  },

  firebaseStopGettingMessages({
    commit
  }) {
    if (messagesRef) {
      console.log("deleting msgs")
      messagesRef.off('child_added')
      commit('clearMessages')
    }
  },

  firebaseSendMessage({}, lol) {
    console.log('Payload: ', lol)
    firebaseDb.ref('chats/'+state.userDetails.userId+'/'+lol.otherUserId).push(lol.message)
    lol.message.from = 'them'
    firebaseDb.ref('chats/'+lol.otherUserId+'/'+state.userDetails.userId).push(lol.message)

  }
}

const getters = {
  users: state => {
    let userFiltered = {}
    Object.keys(state.users).forEach(key => {
      if (key !== state.userDetails.userId) {
        userFiltered[key] = state.users[key]
      }
    })
    return userFiltered
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
