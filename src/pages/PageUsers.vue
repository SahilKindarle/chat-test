<template>
  <q-page class="q-pa-md">
    <q-list separator>
      <q-item
        v-for="(user,key) in users"
        :key="key"
        :to="'/chat/'+key"
        class="q-mb-sm"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            :color="user.online ? 'light-green': 'grey-4'"
          >{{ user.online ? 'Online' : 'Offline'}}</q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("store", ["users"])
  }
};
</script>
