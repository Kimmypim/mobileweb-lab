<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการรายรับ-รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-button expand="block" @click="goToAdd">
        เพิ่มรายการ
      </ion-button>

      <ion-list>
        <ion-item
          button
          v-for="item in expenses"
          :key="item.id"
          @click="editExpense(item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }} | {{ item.type }}</p>
          </ion-label>

          <ion-badge :color="item.type === 'income' ? 'success' : 'danger'">
            {{ item.amount }} บาท
          </ion-badge>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel,
  IonButton, IonBadge
} from '@ionic/vue';

import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

const router = useRouter();
const expenses = ref<any[]>([]);

let unsubscribe: any;

onMounted(() => {
  unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const goToAdd = () => {
  router.push('/tabs/add');
};

const editExpense = (id: string) => {
  router.push('/edit/' + id);
};
</script>