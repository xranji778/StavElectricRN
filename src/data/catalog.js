export const CATEGORIES = [
  { id: 'lighting', label: 'תאורה', icon: 'lightbulb' },
  { id: 'outlets', label: 'שקעים', icon: 'power' },
  { id: 'switches', label: 'מפסקים', icon: 'toggle-on' },
  { id: 'cables', label: 'כבלים', icon: 'cable' },
  { id: 'panels', label: 'לוחות חשמל', icon: 'dashboard' },
  { id: 'safety', label: 'בטיחות והגנה', icon: 'security' },
  { id: 'comms', label: 'תקשורת ומולטימדיה', icon: 'router' },
  { id: 'misc', label: 'אביזרים נוספים', icon: 'category' },
];

export const CATALOG = [
  // תאורה
  { id: 'lightPoint', label: 'נקודת מאור רגילה', icon: 'lightbulb', category: 'lighting', unit: 'נק׳' },
  { id: 'ledCeiling', label: 'נקודת לד תקרה', icon: 'wb-incandescent', category: 'lighting', unit: 'נק׳' },
  { id: 'recessedSpot', label: 'ספוט שקוע', icon: 'highlight', category: 'lighting', unit: 'יח׳' },
  { id: 'wallLamp', label: 'נקודת מנורת קיר', icon: 'wb-iridescent', category: 'lighting', unit: 'נק׳' },
  { id: 'ledStrip', label: 'רצועת לד', icon: 'linear-scale', category: 'lighting', unit: 'מטר' },
  { id: 'chandelier', label: 'נקודת נברשת', icon: 'wb-sunny', category: 'lighting', unit: 'נק׳' },

  // שקעים
  { id: 'outlet16Single', label: 'שקע יחיד 16A', icon: 'power', category: 'outlets', unit: 'יח׳' },
  { id: 'outlet16Double', label: 'שקע כפול 16A', icon: 'power', category: 'outlets', unit: 'יח׳' },
  { id: 'outlet16Triple', label: 'שקע משולש 16A', icon: 'power', category: 'outlets', unit: 'יח׳' },
  { id: 'outletUsb', label: 'שקע USB', icon: 'usb', category: 'outlets', unit: 'יח׳' },
  { id: 'outletWaterproof', label: 'שקע מוגן מים', icon: 'opacity', category: 'outlets', unit: 'יח׳' },
  { id: 'outlet3Phase', label: 'שקע כוח 3-פאזי', icon: 'electrical-services', category: 'outlets', unit: 'יח׳' },

  // מפסקים
  { id: 'switchSingle', label: 'מפסק יחיד', icon: 'toggle-off', category: 'switches', unit: 'יח׳' },
  { id: 'switchDouble', label: 'מפסק כפול', icon: 'toggle-on', category: 'switches', unit: 'יח׳' },
  { id: 'switchCrossover', label: 'מפסק חילופים', icon: 'compare-arrows', category: 'switches', unit: 'יח׳' },
  { id: 'switchDimmer', label: 'מפסק דימר', icon: 'tune', category: 'switches', unit: 'יח׳' },
  { id: 'switchSmart', label: 'מפסק חכם', icon: 'smartphone', category: 'switches', unit: 'יח׳' },

  // כבלים (מטר)
  { id: 'cable3x1_5', label: 'כבל NYM 3×1.5 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cable3x2_5', label: 'כבל NYM 3×2.5 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cable5x2_5', label: 'כבל NYM 5×2.5 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cable3x4', label: 'כבל NYM 3×4 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cable3x6', label: 'כבל NYM 3×6 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cable5x6', label: 'כבל NYM 5×6 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cable3x10', label: 'כבל NYM 3×10 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cable5x10', label: 'כבל NYM 5×10 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },
  { id: 'cableGround16', label: 'כבל אדמה 16 mm²', icon: 'cable', category: 'cables', unit: 'מטר' },

  // לוחות
  { id: 'panel1ph12', label: 'לוח חד-פאזי 12 מודולים', icon: 'dashboard', category: 'panels', unit: 'יח׳' },
  { id: 'panel1ph24', label: 'לוח חד-פאזי 24 מודולים', icon: 'dashboard', category: 'panels', unit: 'יח׳' },
  { id: 'panel3ph24', label: 'לוח תלת-פאזי 24 מודולים', icon: 'view-module', category: 'panels', unit: 'יח׳' },
  { id: 'panel3ph36', label: 'לוח תלת-פאזי 36 מודולים', icon: 'view-module', category: 'panels', unit: 'יח׳' },
  { id: 'panel3ph48', label: 'לוח תלת-פאזי 48 מודולים', icon: 'view-module', category: 'panels', unit: 'יח׳' },

  // בטיחות
  { id: 'rcd', label: 'מפסק פחת', icon: 'security', category: 'safety', unit: 'יח׳' },
  { id: 'mcb16', label: 'מפסק אוטומטי 16A', icon: 'flash-on', category: 'safety', unit: 'יח׳' },
  { id: 'mcb25', label: 'מפסק אוטומטי 25A', icon: 'flash-on', category: 'safety', unit: 'יח׳' },
  { id: 'mcb32', label: 'מפסק אוטומטי 32A', icon: 'flash-on', category: 'safety', unit: 'יח׳' },
  { id: 'mainBreaker', label: 'מפסק זרם ראשי', icon: 'power-settings-new', category: 'safety', unit: 'יח׳' },

  // תקשורת
  { id: 'dataPoint', label: 'נקודת רשת CAT6', icon: 'router', category: 'comms', unit: 'נק׳' },
  { id: 'tvPoint', label: 'נקודת טלוויזיה', icon: 'tv', category: 'comms', unit: 'נק׳' },
  { id: 'intercomPoint', label: 'נקודת אינטרקום', icon: 'phone', category: 'comms', unit: 'נק׳' },
  { id: 'speakerPoint', label: 'נקודת רמקול', icon: 'speaker', category: 'comms', unit: 'נק׳' },
  { id: 'cableCat6', label: 'כבל רשת CAT6', icon: 'settings-ethernet', category: 'comms', unit: 'מטר' },
  { id: 'cableCoax', label: 'כבל קואקסיאלי', icon: 'settings-input-antenna', category: 'comms', unit: 'מטר' },

  // אביזרים
  { id: 'wallBox3', label: 'קופסת קיר 3 מקומות', icon: 'crop-square', category: 'misc', unit: 'יח׳' },
  { id: 'wallBox4', label: 'קופסת קיר 4 מקומות', icon: 'crop-square', category: 'misc', unit: 'יח׳' },
  { id: 'conduit16', label: 'צינור מריכף "16', icon: 'linear-scale', category: 'misc', unit: 'מטר' },
  { id: 'conduit20', label: 'צינור מריכף "20', icon: 'linear-scale', category: 'misc', unit: 'מטר' },
  { id: 'smokeDetector', label: 'גלאי עשן', icon: 'detector-smoke', category: 'misc', unit: 'יח׳' },
];

export function itemsByCategory(categoryId) {
  return CATALOG.filter((i) => i.category === categoryId);
}

export function findItem(itemId) {
  return CATALOG.find((i) => i.id === itemId);
}

export const VAT_RATE = 0.18;
