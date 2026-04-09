<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1" />
        </ion-buttons>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-loading :is-open="loading" message="กำลังโหลด..." />

      <ion-card v-if="!loading">
        <ion-card-header>
          <ion-card-title>แก้ไขค่าใช้จ่าย / รายได้</ion-card-title>
          <ion-card-subtitle>แก้ไขข้อมูลให้ถูกต้อง</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-list lines="full">

            <ion-item>
              <ion-label position="stacked">ชื่อรายการ</ion-label>
              <ion-input
                :value="title"
                @ionInput="title = $event.detail.value || ''"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">จำนวนเงิน</ion-label>
              <ion-input
                type="number"
                :value="amount"
                @ionInput="amount = $event.detail.value || ''"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">ประเภท</ion-label>
              <ion-select
                :value="type"
                @ionChange="type = $event.detail.value || 'expense'"
              >
                <ion-select-option value="income">รายรับ</ion-select-option>
                <ion-select-option value="expense">รายจ่าย</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">หมวดหมู่</ion-label>
              <ion-input
                :value="category"
                @ionInput="category = $event.detail.value || ''"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">หมายเหตุ</ion-label>
              <ion-textarea
                :value="note"
                @ionInput="note = $event.detail.value || ''"
              />
            </ion-item>

          </ion-list>

          <ion-button expand="block" color="danger" @click="confirmDelete">
            ลบข้อมูล
          </ion-button>

          <ion-button expand="block" :disabled="!isValid" @click="updateExpense">
            อัปเดตข้อมูล
          </ion-button>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonList, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonButton, IonLoading,
  alertController
} from '@ionic/vue';

import { ref, computed, onMounted } from "vue";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const title = ref("");
const amount = ref("");
const type = ref("expense");
const category = ref("");
const note = ref("");

const isValid = computed(() => {
  return (
    title.value.trim().length > 0 &&
    Number(amount.value) > 0 &&
    category.value.trim().length > 0
  );
});

onMounted(async () => {
  const id = route.params.id as string;

  if (!id) {
    loading.value = false;
    return;
  }

  try {
    const docSnap = await getDoc(doc(db, "expenses", id));

    if (docSnap.exists()) {
      const data: any = docSnap.data();
      title.value = data.title || "";
      amount.value = data.amount?.toString() || "";
      type.value = data.type || "expense";
      category.value = data.category || "";
      note.value = data.note || "";
    }
  } catch (e) {
    console.error(e);
  }

  loading.value = false;
});

const updateExpense = async () => {
  const id = route.params.id as string;
  if (!id || !isValid.value) return;

  await updateDoc(doc(db, "expenses", id), {
    title: title.value.trim(),
    amount: Number(amount.value),
    type: type.value,
    category: category.value.trim(),
    note: note.value.trim(),
    updatedAt: new Date()
  });

  router.push('/tabs/tab1');
};

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ',
    message: 'ต้องการลบใช่ไหม?',
    buttons: [
      { text: 'ยกเลิก', role: 'cancel' },
      { text: 'ลบ', role: 'destructive', handler: deleteExpense }
    ]
  });

  await alert.present();
};

const deleteExpense = async () => {
  const id = route.params.id as string;
  if (!id) return;

  await deleteDoc(doc(db, "expenses", id));
  router.push('/tabs/tab1');
};
</script>