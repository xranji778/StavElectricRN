import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

const PHOTOS_DIR = `${FileSystem.documentDirectory}quote-photos/`;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

export async function pickFromGallery() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    quality: 0.7,
  });
  if (result.canceled) return null;
  return await persistPicked(result.assets);
}

export async function takePhoto() {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (result.canceled) return null;
  return await persistPicked(result.assets);
}

async function persistPicked(assets) {
  await ensureDir();
  const out = [];
  for (const a of assets || []) {
    const ext = (a.uri.split('.').pop() || 'jpg').split('?')[0];
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dest = PHOTOS_DIR + filename;
    try {
      await FileSystem.copyAsync({ from: a.uri, to: dest });
      out.push({
        id: filename,
        uri: dest,
        width: a.width || 0,
        height: a.height || 0,
        addedAt: Date.now(),
      });
    } catch (e) {
      // skip files that fail to copy
    }
  }
  return out;
}

export async function deletePhotoFile(photo) {
  if (!photo?.uri) return;
  try {
    const info = await FileSystem.getInfoAsync(photo.uri);
    if (info.exists) await FileSystem.deleteAsync(photo.uri, { idempotent: true });
  } catch (e) {
    // best-effort
  }
}

export async function readPhotoAsBase64(uri) {
  try {
    return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  } catch (e) {
    return null;
  }
}
