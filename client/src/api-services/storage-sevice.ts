import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "../config/firebase-config";

// SUBIR ARCHIVO A FIREBASE Y DEVOLVER URL
export const uploadFileAndReturnUrl = async (file: any) => {
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage, `images/${file.name}`);
  const response = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};
