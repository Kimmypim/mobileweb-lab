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
                placeholder="เช่น ค่าอาหารกลางวัน"
                clear-input
                :value="title"
                @ionInput="title = $event.detail.value!"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">จำนวนเงิน</ion-label>
              <ion-input
                type="number"
                placeholder="เช่น 250"
                clear-input
                :value="amount"
                @ionInput="amount = $event.detail.value!"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">ประเภท</ion-label>
              <ion-select
                :value="type"
                interface="popover"
                @ionChange="type = $event.detail.value"
              >
                <ion-select-option value="income">รายรับ</ion-select-option>
                <ion-select-option value="expense">รายจ่าย</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">หมวดหมู่</ion-label>
              <ion-input
                placeholder="เช่น อาหาร, เดินทาง"
                clear-input
                :value="category"
                @ionInput="category = $event.detail.value!"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">หมายเหตุ</ion-label>
              <ion-textarea
                placeholder="เพิ่มรายละเอียดเพิ่มเติม"
                auto-grow
                :value="note"
                @ionInput="note = $event.detail.value!"
              />
            </ion-item>

          </ion-list>

          <div class="button-row">
            <ion-button expand="block" fill="outline" color="danger" @click="confirmDelete">
              ลบข้อมูล
            </ion-button>

            <ion-button expand="block" :disabled="!isValid" @click="updateExpense">
              อัปเดตข้อมูล
            </ion-button>
          </div>

        </ion-card-content>
      </ion-card>

      <ion-loading :is-open="loading" message="กำลังโหลด..." />
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
    console.error("No ID provided");
    loading.value = false;
    return;
  }

  try {
    const docRef = doc(db, "expenses", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data: any = docSnap.data();
      title.value = data.title || "";
      amount.value = data.amount ? data.amount.toString() : "";
      type.value = data.type || "expense";
      category.value = data.category || "";
      note.value = data.note || "";
    } else {
      console.error("Document not found");
    }
  } catch (error) {
    console.error("Error loading document:", error);
  }

  loading.value = false;
});

const updateExpense = async () => {
  if (!isValid.value) return;

  const id = route.params.id as string;

  if (!id) return;

  const docRef = doc(db, "expenses", id);

  await updateDoc(docRef, {
    title: title.value.trim(),
    amount: Number(amount.value || 0),
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
    message: 'คุณต้องการลบรายการนี้หรือไม่?',
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

  const docRef = doc(db, "expenses", id);
  await deleteDoc(docRef);

  router.push('/tabs/tab1');
};
</script>

<style scoped>
.button-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1.25rem;
}

ion-card {
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

@media (max-width: 480px) {
  .button-row {
    grid-template-columns: 1fr;
  }
}
</style>