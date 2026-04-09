<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1" />
        </ion-buttons>
        <ion-title>เพิ่มรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>บันทึกค่าใช้จ่าย / รายได้</ion-card-title>
          <ion-card-subtitle>กรอกข้อมูลให้ครบเพื่อจัดการได้ง่ายขึ้น</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-list lines="full">
            <ion-item>
              <ion-label position="stacked">ชื่อรายการ</ion-label>
              <ion-input
                placeholder="เช่น ค่าอาหารกลางวัน"
                clear-input
                v-model="title"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">จำนวนเงิน</ion-label>
              <ion-input
                type="number"
                placeholder="เช่น 250"
                clear-input
                v-model="amount"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">ประเภท</ion-label>
              <ion-select v-model="type" interface="popover">
                <ion-select-option value="income">รายรับ</ion-select-option>
                <ion-select-option value="expense">รายจ่าย</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">หมวดหมู่</ion-label>
              <ion-input
                placeholder="เช่น อาหาร, เดินทาง"
                clear-input
                v-model="category"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">หมายเหตุ</ion-label>
              <ion-textarea
                placeholder="เพิ่มรายละเอียดเพิ่มเติม (ไม่บังคับ)"
                auto-grow
                v-model="note"
              />
            </ion-item>
          </ion-list>

          <div class="button-row">
            <ion-button expand="block" fill="outline" @click="cancel">
              ยกเลิก
            </ion-button>
            <ion-button expand="block" :disabled="!isValid" @click="saveExpense">
              บันทึกข้อมูล
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton
} from '@ionic/vue';
import { ref, computed } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const amount = ref(0);
const type = ref("expense");
const category = ref("");
const note = ref("");

const isValid = computed(() => {
  return title.value.trim().length > 0 && Number(amount.value) > 0 && category.value.trim().length > 0;
});

const saveExpense = async () => {
  if (!isValid.value) {
    return;
  }

  await addDoc(collection(db, "expenses"), {
    title: title.value.trim(),
    amount: Number(amount.value),
    type: type.value,
    category: category.value.trim(),
    note: note.value.trim(),
    createdAt: new Date()
  });

  router.push('/tabs/tab1');
};

const cancel = () => {
  router.push('/tabs/tab1');
};
</script>

<style scoped>
.button-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}

ion-card {
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

ion-card-title {
  font-size: 1.2rem;
  font-weight: 700;
}

ion-card-subtitle {
  color: var(--ion-color-medium);
  margin-top: 0.25rem;
}

@media (max-width: 480px) {
  .button-row {
    grid-template-columns: 1fr;
  }
}
</style>
