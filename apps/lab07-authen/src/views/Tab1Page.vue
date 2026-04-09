<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Info</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>ข้อมูลผู้ใช้</h2>

      <div v-if="user">
        <p><strong>UID:</strong> {{ user.uid }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Name:</strong> {{ user.displayName }}</p>
      </div>

      <div v-else>
        <p>ยังไม่ได้ login</p>
      </div>

      <ion-button expand="block" color="danger" @click="logout">
        Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from "@ionic/vue";
import { authService } from "@/auth/auth-service";

const user = ref<any>(null);
const router = useRouter();

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const logout = async () => {
  await authService.logout();
  router.push("/login");
};
</script>