<template>
  <q-form @submit="submitForm">
    <q-input
      outlined
      v-model="formData.name"
      class="q-mb-md"
      label="Name"
      v-if="tab == 'register'"
    />
    <q-input outlined v-model="formData.email" class="q-mb-md" label="Email" type="email" />
    <q-input outlined v-model="formData.password" class="q-mb-md" label="Password" type="password" />
    <div class="row">
      <q-space />
      <q-btn color="primary" :label="tab" type="submit" />
    </div>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: ["tab"],
  data() {
    return {
      formData: {
        name: "",
        password: "",
        email: ""
      }
    };
  },
  methods:{
    ...mapActions('store',['registerUser', 'loginUser']),
      submitForm(){
          if(this.tab == 'login'){
            this.loginUser(this.formData)
          }
          else{
              this.registerUser(this.formData) 
          }
      }
  }
};
</script>

<style>
</style>