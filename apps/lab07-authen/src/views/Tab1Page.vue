<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>User Info</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding user-info-page">
      <div class="user-shell">
        <section class="profile-header" v-if="user">
          <div class="avatar">{{ user.displayName ? user.displayName.slice(0, 1).toUpperCase() : "U" }}</div>
          <div class="profile-text">
            <h2>{{ user.displayName || "Guest User" }}</h2>
            <p>{{ user.email || "อีเมลไม่พร้อมใช้งาน" }}</p>
          </div>
        </section>

        <ion-card class="info-card">
          <ion-card-header>
            <ion-card-title>รายละเอียดบัญชี</ion-card-title>
            <ion-card-subtitle>ข้อมูลผู้ใช้ของคุณ</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <div v-if="user" class="info-list">
              <div class="info-item">
                <span>UID</span>
                <strong>{{ user.uid }}</strong>
              </div>
              <div class="info-item">
                <span>Email</span>
                <strong>{{ user.email }}</strong>
              </div>
              <div class="info-item">
                <span>Name</span>
                <strong>{{ user.displayName || "-" }}</strong>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>ยังไม่มีข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบก่อน</p>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-button expand="block" color="danger" @click="logout">Logout</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/vue";
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

<style scoped>
.user-info-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%);
}

.user-shell {
  max-width: 540px;
  margin: 1rem auto;
  display: grid;
  gap: 1.25rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.25rem;
  border-radius: 1.5rem;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.avatar {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: linear-gradient(135deg, #4338ca, #2563eb);
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
}

.profile-text h2 {
  margin: 0;
  font-size: 1.45rem;
  color: #0f172a;
}

.profile-text p {
  margin: 0.3rem 0 0;
  color: #475569;
  font-size: 0.98rem;
}

.info-card {
  border-radius: 1.5rem;
  overflow: hidden;
}

ion-card-header {
  padding: 1.3rem 1.5rem 0.75rem;
}

ion-card-title {
  font-size: 1.2rem;
  color: #111827;
}

ion-card-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.info-list {
  display: grid;
  gap: 1rem;
  padding: 0.75rem 0 1.25rem 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.info-item span {
  color: #64748b;
  font-size: 0.95rem;
}

.info-item strong {
  color: #0f172a;
  font-size: 1rem;
}

.empty-state {
  padding: 1.2rem 1.1rem;
  color: #475569;
  font-size: 0.97rem;
}

ion-button {
  border-radius: 1rem;
}
</style>