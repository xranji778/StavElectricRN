# StavElectric — React Native ⚡

גרסת **React Native (Expo)** של אפליקציית StavElectric — הצעות מחיר לחשמלאים, עברית RTL, אופליין-first.

## איך להריץ על הטלפון (Expo Go)

### על המחשב

```powershell
cd "C:\Users\stavc\Desktop\StavElectricRN"
npx.cmd expo start
```

יופיע **QR code** בטרמינל.

### על הטלפון

1. הורד את האפליקציה **Expo Go**:
   - Android: <https://play.google.com/store/apps/details?id=host.exp.exponent>
   - iPhone: <https://apps.apple.com/app/expo-go/id982107779>
2. ודא שהטלפון והמחשב **באותה רשת WiFi**.
3. פתח את Expo Go ולחץ **"Scan QR code"** → סרוק את ה-QR מהטרמינל.
4. האפליקציה תיטען לטלפון תוך כמה שניות.

> **לא עובד?** בדוק שה-WiFi זהה, או נסה את **Tunnel mode** עם `npx expo start --tunnel`.

## מה כלול

- 3 לשוניות בתחתית: **בית · הצעת מחיר · תעריפים**
- **בית** — ברכת שלום לפי שעה, באנר תעריפים חסרים, CTA להצעה חדשה, סטטיסטיקה (סה״כ הצעות + סכום החודש), 5 הצעות אחרונות
- **הצעת מחיר** — שם לקוח, בחירת פריטים מהקטלוג, stepper לכמות, חישוב מע״מ 18% חי, שמירה
- **תעריפים** — 5 שדות מחיר (נקודת מאור, לוח תלת-פאזי, מפסק חכם, קופסת קיר 3/4), שמירה ב-AsyncStorage
- **RTL מלא** + גופן **Heebo** (Google Fonts)
- אופליין מלא — הכל ב-AsyncStorage על הטלפון

## מבנה הפרויקט

```
StavElectricRN/
├── App.js                          # entry — RTL, fonts, navigation
├── app.json                        # config Expo
├── src/
│   ├── theme/colors.js            # פלטה
│   ├── utils/currency.js          # פורמט ₪
│   ├── data/
│   │   ├── catalog.js             # 5 הפריטים
│   │   └── storage.js             # AsyncStorage wrapper
│   └── screens/
│       ├── HomeScreen.js
│       ├── QuoteBuilderScreen.js
│       └── RatesScreen.js
```

## פיתוח חי

עורך קובץ ב-VS Code → שומר → האפליקציה ב-Expo Go מתעדכנת אוטומטית (Fast Refresh).
