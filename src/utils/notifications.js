import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let configured = false;

async function ensureConfigured() {
  if (configured) return;
  configured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

export async function ensurePermission() {
  await ensureConfigured();
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return !!req.granted;
}

export async function scheduleEventNotification({ title, body, fireAt }) {
  await ensureConfigured();
  const ts = Number(fireAt);
  if (!Number.isFinite(ts) || ts <= Date.now() + 1000) return null;
  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default' },
    trigger: { type: 'date', date: new Date(ts) },
  });
  return id;
}

export async function cancelNotification(id) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    // best-effort
  }
}
