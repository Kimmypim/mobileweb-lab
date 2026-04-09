<template>
  <ion-page>
    <ion-content class="login-page">
      <div class="login-shell">
        <div class="brand-block">
          <div class="brand-mark">A</div>
          <div>
            <h1>Welcome Back</h1>
            <p>ลงชื่อเข้าใช้เพื่อเข้าถึงข้อมูลและบริการของคุณ</p>
          </div>
        </div>

        <ion-card class="login-card">
          <ion-card-content>
            <div class="card-header">
              <h2>Login</h2>
              <p>เข้าสู่ระบบอย่างปลอดภัยด้วยอีเมลหรือ Google</p>
            </div>

            <ion-item class="input-item" lines="full">
              <ion-label position="floating">Email</ion-label>
              <ion-input v-model="email" type="email" autocomplete="email"></ion-input>
            </ion-item>

            <ion-item class="input-item" lines="full">
              <ion-label position="floating">Password</ion-label>
              <ion-input v-model="password" type="password" autocomplete="current-password"></ion-input>
            </ion-item>

            <div class="action-group">
              <ion-button expand="block" color="primary" @click="loginEmail">Login</ion-button>
              <ion-button expand="block" fill="outline" color="medium" @click="loginGoogle">
                Login with Google
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <p class="footer-note">ยังไม่มีบัญชี? ลงทะเบียนได้ที่หน้าหลัก</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authService } from "@/auth/auth-service";
import { useRouter } from "vue-router";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/vue";

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

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 1.5rem 1rem;
  background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.22), transparent 36%),
    linear-gradient(135deg, #3b82f6 0%, #06b6d4 65%, #0f172a 100%);
}

.login-shell {
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  border-radius: 1.25rem;
  padding: 1rem 1.25rem;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.35rem;
}

.brand-block h1,
.brand-block p,
.card-header p,
.footer-note {
  color: #f8fafc;
}

.brand-block h1 {
  margin: 0;
  font-size: 1.35rem;
  letter-spacing: 0.02em;
}

.brand-block p {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  opacity: 0.95;
}

.login-card {
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 22px 90px rgba(15, 23, 42, 0.18);
}

ion-card-content {
  padding: 1.75rem 1.5rem 2rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #111827;
}

.card-header p {
  margin: 0.5rem 0 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
}

.input-item {
  margin-top: 1rem;
  border-radius: 1rem;
  background: #f8fafc;
}

.action-group {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.5rem;
}

ion-button {
  border-radius: 1rem;
}

.footer-note {
  margin: 0;
  font-size: 0.9rem;
  text-align: center;
  color: rgba(248, 250, 252, 0.85);
}
</style>