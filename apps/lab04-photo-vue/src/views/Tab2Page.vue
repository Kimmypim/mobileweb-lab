<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>

        <ion-content :fullscreen="true">

   <!--Student Info Card -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>ข้อมูลนักศึกษา</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>รหัส:</strong> 663380509-5</p>
          <p><strong>ชื่อ:</strong> พิมอัปสร แพน</p>
        </ion-card-content>
      </ion-card>

      <!--Photo Grid -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="photo in photos" :key="photo.filepath">
            <ion-img
              :src="photo.webviewPath"
              style="border-radius: 12px; margin-bottom: 8px;"
            ></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!--Floating Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="takePhoto">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- CHANGE: Remove or comment out <ExploreContainer /> -->
      <!-- <ExploreContainer name="Tab 2 page" /> -->
    </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { camera } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

import {
  IonPage, IonHeader, IonFab, IonFabButton, IonIcon,
  IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonImg,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/vue';



const photos = ref<any[]>([]);


const takePhoto = async () => {
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.Base64, // 🔥 สำคัญ
    source: CameraSource.Camera,
    quality: 60
  });

  const fileName = new Date().getTime() + '.jpeg';


  await Filesystem.writeFile({
    path: fileName,
    data: photo.base64String!,
    directory: Directory.Data
  });


  photos.value.unshift({
    filepath: fileName,
    webviewPath: `data:image/jpeg;base64,${photo.base64String}`
  });
};


const loadSaved = async () => {
  const result = await Filesystem.readdir({
    path: '',
    directory: Directory.Data
  });

  photos.value = [];

  for (const file of result.files) {
    const fileData = await Filesystem.readFile({
      path: file.name,
      directory: Directory.Data
    });

    photos.value.push({
      filepath: file.name,
      webviewPath: `data:image/jpeg;base64,${fileData.data}`
    });
  }
};

onMounted(() => {
  loadSaved();
});
</script>