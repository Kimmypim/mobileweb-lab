import { useState, useEffect } from 'react';
import { camera } from 'ionicons/icons';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonFab, IonFabButton, IonIcon,
  IonGrid, IonRow, IonCol, IonImg
} from '@ionic/react';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import './Tab2.css';

// ================== TYPE ==================
interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

// ================== HOOK ==================
function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  // 📷 ถ่ายรูป
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + '.jpeg';

    // 💾 save ลงเครื่อง
    await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String!,
      directory: Directory.Data,
    });

    const newPhoto: UserPhoto = {
      filepath: fileName,
      webviewPath: `data:image/jpeg;base64,${photo.base64String}`,
    };

    const newPhotos = [newPhoto, ...photos];
    setPhotos(newPhotos);

    // 💾 save list
    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newPhotos),
    });
  };

  // 🔄 โหลดรูปตอนเปิดแอป
  const loadSaved = async () => {
    const { value } = await Preferences.get({ key: PHOTO_STORAGE });
    if (value) {
      setPhotos(JSON.parse(value));
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  return {
    photos,
    takePhoto,
  };
}

// ================== COMPONENT ==================
const Tab2: React.FC = () => {
  const { photos, takePhoto } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
          <IonTitle size="small">
            Lab 05 - โดย พิมอัปสร แพน รหัส 663380509-5
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
            <IonTitle size="small">
              Lab 05 - โดย พิมอัปสร แพน รหัส 663380509-5
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* 🖼 แสดงรูป */}
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* 📷 ปุ่มถ่ายรูป */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;