<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h2>Login</h2>

      <ion-input v-model="email" placeholder="Email"></ion-input>
      <ion-input v-model="password" type="password" placeholder="Password"></ion-input>

      <ion-button @click="loginEmail">Login Email</ion-button>
      <ion-button @click="loginGoogle">Login Google</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";
import { authService } from "@/auth/auth-service";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const loginEmail = async () => {
  await authService.loginWithEmailPassword({
    email: email.value,
    password: password.value,
  });
  router.push("/tabs/tab1");
};

const loginGoogle = async () => {
  await authService.loginWithGoogle();
  router.push("/tabs/tab1");
};
</script>