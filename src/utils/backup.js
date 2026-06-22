import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { exportAllUserData, importAllUserData } from '../data/storage';

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

export async function exportBackup(user) {
  const data = await exportAllUserData(user.id);
  const json = JSON.stringify({
    ...data,
    userProfile: {
      displayName: user.displayName,
      businessName: user.businessName,
      phone: user.phone,
      email: user.email,
      licenseNumber: user.licenseNumber,
      address: user.address,
    },
  }, null, 2);
  const fileName = `proquote_backup_${timestamp()}.json`;
  const uri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, json, { encoding: FileSystem.EncodingType.UTF8 });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      dialogTitle: 'גיבוי הצעות מחיר',
      mimeType: 'application/json',
    });
  }
  return { uri, fileName, json };
}

export async function importBackup(user) {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;
  const asset = result.assets?.[0];
  if (!asset?.uri) return null;
  const content = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error('הקובץ אינו JSON תקין');
  }
  const stats = await importAllUserData(user.id, parsed);
  return stats;
}
