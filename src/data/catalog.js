export const CATEGORIES = [
  // ============ חשמלאי ============
  { id: 'lighting', label: 'תאורה', icon: 'lightbulb', professions: ['electrician'] },
  { id: 'outlets', label: 'שקעים', icon: 'power', professions: ['electrician'] },
  { id: 'switches', label: 'מפסקים', icon: 'toggle-on', professions: ['electrician'] },
  { id: 'cables', label: 'כבלים', icon: 'cable', professions: ['electrician'], isMaterial: true },
  { id: 'conduits', label: 'צנרת', icon: 'plumbing', professions: ['electrician'], isMaterial: true },
  { id: 'panels', label: 'לוחות חשמל', icon: 'dashboard', professions: ['electrician'] },
  { id: 'safety', label: 'בטיחות והגנה', icon: 'security', professions: ['electrician'] },
  { id: 'control', label: 'בקרה וטיימרים', icon: 'schedule', professions: ['electrician'] },
  { id: 'comms', label: 'תקשורת ומולטימדיה', icon: 'router', professions: ['electrician'] },
  { id: 'smartHome', label: 'בית חכם', icon: 'smart-toy', professions: ['electrician'] },
  { id: 'energy', label: 'אנרגיה וטעינה', icon: 'solar-power', professions: ['electrician'] },
  { id: 'boxes', label: 'קופסאות', icon: 'inventory-2', professions: ['electrician'], isMaterial: true },
  { id: 'frames', label: 'מסגרות', icon: 'crop-free', professions: ['electrician'], isMaterial: true },
  { id: 'elecMatDevices', label: 'אביזרי שקעים ומפסקים', icon: 'power', professions: ['electrician'], isMaterial: true },
  { id: 'elecMatPanel', label: 'ציוד ללוח חשמל', icon: 'dashboard', professions: ['electrician'], isMaterial: true },
  { id: 'elecMatLighting', label: 'גופי תאורה ונורות', icon: 'lightbulb', professions: ['electrician'], isMaterial: true },
  { id: 'elecMatConnectors', label: 'מהדקים, חיבורים והארקה', icon: 'settings-input-component', professions: ['electrician'], isMaterial: true },
  { id: 'elecMatConsumables', label: 'ברגים, דיבלים ומתכלים', icon: 'hardware', professions: ['electrician'], isMaterial: true },

  // ============ אינסטלטור ============
  { id: 'plumbWater', label: 'נקודות מים וצנרת', icon: 'water-drop', professions: ['plumber'] },
  { id: 'plumbDrain', label: 'ניקוז וביוב', icon: 'waves', professions: ['plumber'] },
  { id: 'plumbSanitary', label: 'התקנת כלים סניטריים', icon: 'wc', professions: ['plumber'] },
  { id: 'plumbFaucets', label: 'ברזים ומערבלים', icon: 'plumbing', professions: ['plumber'] },
  { id: 'plumbHeating', label: 'דודים וחימום מים', icon: 'hot-tub', professions: ['plumber'] },
  { id: 'plumbService', label: 'שירות, סתימות ונזילות', icon: 'build', professions: ['plumber'] },
  { id: 'plumbMatWater', label: 'צנרת ואביזרי מים', icon: 'linear-scale', professions: ['plumber'], isMaterial: true },
  { id: 'plumbMatDrain', label: 'צנרת ואביזרי ביוב', icon: 'linear-scale', professions: ['plumber'], isMaterial: true },
  { id: 'plumbMatGeneral', label: 'אטימה ומתכלים', icon: 'inventory-2', professions: ['plumber'], isMaterial: true },

  // ============ איש תקשורת ============
  { id: 'cmPoints', label: 'נקודות תקשורת', icon: 'settings-ethernet', professions: ['comms'] },
  { id: 'cmRack', label: 'ארון תקשורת ותשתית', icon: 'dns', professions: ['comms'] },
  { id: 'cmNetwork', label: 'ציוד רשת ו-WiFi', icon: 'wifi', professions: ['comms'] },
  { id: 'cmCctv', label: 'מצלמות אבטחה', icon: 'videocam', professions: ['comms'] },
  { id: 'cmAlarm', label: 'אזעקה', icon: 'notifications-active', professions: ['comms'] },
  { id: 'cmIntercom', label: 'אינטרקום ובקרת כניסה', icon: 'doorbell', professions: ['comms'] },
  { id: 'cmAv', label: 'שמע ומולטימדיה', icon: 'speaker', professions: ['comms'] },
  { id: 'cmService', label: 'שירות ותחזוקה', icon: 'build', professions: ['comms'] },
  { id: 'cmMatCables', label: 'כבלים', icon: 'cable', professions: ['comms'], isMaterial: true },
  { id: 'cmMatParts', label: 'אביזרים וחיבורים', icon: 'settings-input-component', professions: ['comms'], isMaterial: true },
  { id: 'cmMatEquipment', label: 'ציוד להזמנה', icon: 'router', professions: ['comms'], isMaterial: true },

  // ============ משותף לכל המקצועות ============
  { id: 'misc', label: 'אביזרים נוספים', icon: 'category', professions: ['electrician', 'plumber', 'comms'] },
];

export const CATALOG = [
  // ============ תאורה ============
  { id: 'lightPoint', label: 'נקודת מאור', icon: 'lightbulb', category: 'lighting', unit: 'point' },
  { id: 'recessedSpot', label: 'התקנת ספוט שקוע', icon: 'highlight', category: 'lighting', unit: 'piece' },
  { id: 'wallLamp', label: 'נקודת מנורת קיר', icon: 'wb-iridescent', category: 'lighting', unit: 'point', hidden: true },
  { id: 'gardenLight', label: 'גוף תאורת גינה', icon: 'park', category: 'lighting', unit: 'piece', hidden: true },
  { id: 'lightFixtureInstall', label: 'התקנת גוף תאורה', icon: 'light', category: 'lighting', unit: 'piece' },
  { id: 'ledProfileInstall', label: 'התקנת פרופיל לד', icon: 'linear-scale', category: 'lighting', unit: 'meter' },
  { id: 'spotChaining', label: 'שירשור ספוט', icon: 'device-hub', category: 'lighting', unit: 'piece' },
  { id: 'emergencyLight', label: 'תאורת חירום', icon: 'emergency', category: 'lighting', unit: 'piece' },

  // ============ שקעים ============
  { id: 'outlet16Single', label: 'שקע כח יחיד', icon: 'power', category: 'outlets', unit: 'piece' },
  { id: 'outlet16Double', label: 'שקע כח כפול', icon: 'power', category: 'outlets', unit: 'piece' },
  { id: 'outlet16Triple', label: 'שלישיית שקעים', icon: 'power', category: 'outlets', unit: 'piece' },
  { id: 'outletUsb', label: 'אביזר USB', icon: 'usb', category: 'outlets', unit: 'piece' },
  { id: 'outletWaterproof', label: 'שקע מוגן מים', icon: 'opacity', category: 'outlets', unit: 'piece' },
  // שקע תלת פאזי (משפחה — לפי עובי כבל, עד 10 מ׳)
  { id: 'outlet3Phase', family: 'outlet3Phase', familyLabel: 'שקע תלת פאזי (עד 10 מ׳)', size: '5×2.5', sizeUnit: ' mm²', label: 'שקע תלת פאזי 5×2.5 עד 10 מ׳', icon: 'electrical-services', category: 'outlets', unit: 'piece' },
  { id: 'outlet3Phase_5x4', family: 'outlet3Phase', familyLabel: 'שקע תלת פאזי (עד 10 מ׳)', size: '5×4', sizeUnit: ' mm²', label: 'שקע תלת פאזי 5×4 עד 10 מ׳', icon: 'electrical-services', category: 'outlets', unit: 'piece' },
  { id: 'outlet3Phase_5x6', family: 'outlet3Phase', familyLabel: 'שקע תלת פאזי (עד 10 מ׳)', size: '5×6', sizeUnit: ' mm²', label: 'שקע תלת פאזי 5×6 עד 10 מ׳', icon: 'electrical-services', category: 'outlets', unit: 'piece' },
  { id: 'outletFloor', label: 'שקע רצפה (לא כולל אביזר)', icon: 'south', category: 'outlets', unit: 'piece' },
  { id: 'outletWithSwitch', label: 'שקע עם מפסק', icon: 'toggle-on', category: 'outlets', unit: 'piece', hidden: true },
  { id: 'outletPhone', label: 'שקע טלפון - חוט משיכה', icon: 'phone', category: 'outlets', unit: 'piece' },
  { id: 'outletPower', label: 'נקודת שקע רגיל', icon: 'electrical-services', category: 'outlets', unit: 'piece' },
  { id: 'ventPoint', label: 'נקודת וונטה', icon: 'air', category: 'outlets', unit: 'point' },

  // ============ מפסקים ============
  { id: 'switchSingle', label: 'מפסק יחיד', icon: 'toggle-off', category: 'switches', unit: 'piece', hidden: true },
  { id: 'switchDouble', label: 'מפסק כפול', icon: 'toggle-on', category: 'switches', unit: 'piece', hidden: true },
  { id: 'switchCrossover', label: 'מפסק חילופים', icon: 'compare-arrows', category: 'switches', unit: 'piece' },
  { id: 'switchIntermediate', label: 'מפסק צלב', icon: 'shuffle', category: 'switches', unit: 'piece' },
  { id: 'switchDimmer', label: 'מפסק דימר', icon: 'tune', category: 'switches', unit: 'piece' },
  { id: 'switchSmart', label: 'מפסק חכם', icon: 'smartphone', category: 'switches', unit: 'piece', hidden: true },
  { id: 'switchTimer', label: 'טיימר לדוד', icon: 'timer', category: 'switches', unit: 'piece' },

  // ============ כבלים ============
  { id: 'cable3x1_5', label: 'כבל NYM 3×1.5 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable3x2_5', label: 'כבל NYM 3×2.5 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable5x2_5', label: 'כבל NYM 5×2.5 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable3x4', label: 'כבל NYM 3×4 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable3x6', label: 'כבל NYM 3×6 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable5x6', label: 'כבל NYM 5×6 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable3x10', label: 'כבל NYM 3×10 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable5x10', label: 'כבל NYM 5×10 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cableGround16', label: 'כבל אדמה 16 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cableGround25', label: 'כבל אדמה 25 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable5x1_5', label: 'כבל NYM 5×1.5 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable5x4', label: 'כבל NYM 5×4 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cable5x16', label: 'כבל NYM 5×16 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cableN2xy4x16', label: 'כבל N2XY 4×16 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cableN2xy4x25', label: 'כבל N2XY 4×25 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cableFlex3x1_5', label: 'כבל גמיש 3×1.5 mm²', icon: 'cable', category: 'cables', unit: 'meter' },
  { id: 'cableFlex3x2_5', label: 'כבל גמיש 3×2.5 mm²', icon: 'cable', category: 'cables', unit: 'meter' },

  // חוט מושחל (משפחה — לפי חתך)
  { id: 'wire_1_5', family: 'wire', familyLabel: 'חוט מושחל', size: '1.5', sizeUnit: ' mm²', label: 'חוט מושחל 1.5 mm²', icon: 'timeline', category: 'cables', unit: 'meter' },
  { id: 'wire_2_5', family: 'wire', familyLabel: 'חוט מושחל', size: '2.5', sizeUnit: ' mm²', label: 'חוט מושחל 2.5 mm²', icon: 'timeline', category: 'cables', unit: 'meter' },
  { id: 'wire_4', family: 'wire', familyLabel: 'חוט מושחל', size: '4', sizeUnit: ' mm²', label: 'חוט מושחל 4 mm²', icon: 'timeline', category: 'cables', unit: 'meter' },
  { id: 'wire_6', family: 'wire', familyLabel: 'חוט מושחל', size: '6', sizeUnit: ' mm²', label: 'חוט מושחל 6 mm²', icon: 'timeline', category: 'cables', unit: 'meter' },
  { id: 'wire_10', family: 'wire', familyLabel: 'חוט מושחל', size: '10', sizeUnit: ' mm²', label: 'חוט מושחל 10 mm²', icon: 'timeline', category: 'cables', unit: 'meter' },
  { id: 'wire_16', family: 'wire', familyLabel: 'חוט מושחל', size: '16', sizeUnit: ' mm²', label: 'חוט מושחל 16 mm²', icon: 'timeline', category: 'cables', unit: 'meter' },

  // ============ צנרת ============

  // צינור מריכף (3 גדלים)
  { id: 'conduitMarichef_16', family: 'conduitMarichef', familyLabel: 'צינור מריכף', size: '16', label: 'צינור מריכף 16', icon: 'linear-scale', category: 'conduits', unit: 'meter' },
  { id: 'conduitMarichef_20', family: 'conduitMarichef', familyLabel: 'צינור מריכף', size: '20', label: 'צינור מריכף 20', icon: 'linear-scale', category: 'conduits', unit: 'meter' },
  { id: 'conduitMarichef_25', family: 'conduitMarichef', familyLabel: 'צינור מריכף', size: '25', label: 'צינור מריכף 25', icon: 'linear-scale', category: 'conduits', unit: 'meter' },

  // צינור שרשורי (2 גדלים)
  { id: 'conduitShirshuri_16', family: 'conduitShirshuri', familyLabel: 'צינור שרשורי', size: '16', label: 'צינור שרשורי 16', icon: 'waves', category: 'conduits', unit: 'meter' },
  { id: 'conduitShirshuri_20', family: 'conduitShirshuri', familyLabel: 'צינור שרשורי', size: '20', label: 'צינור שרשורי 20', icon: 'waves', category: 'conduits', unit: 'meter' },

  // צינור קוברה (גודל יחיד)
  { id: 'conduitCobra_50', family: 'conduitCobra', familyLabel: 'צינור קוברה', size: '50', label: 'צינור קוברה 50', icon: 'polymer', category: 'conduits', unit: 'meter' },

  // צינור פיגי / PG (2 גדלים - חיצוני עמיד UV)
  { id: 'conduitPG_16', family: 'conduitPG', familyLabel: 'צינור פיגי', size: '16', label: 'צינור פיגי 16', icon: 'wb-sunny', category: 'conduits', unit: 'meter' },
  { id: 'conduitPG_20', family: 'conduitPG', familyLabel: 'צינור פיגי', size: '20', label: 'צינור פיגי 20', icon: 'wb-sunny', category: 'conduits', unit: 'meter' },

  // צינור מרירון (4 גדלים - באינץ')
  { id: 'conduitMariron_34', family: 'conduitMariron', familyLabel: 'צינור מרירון', size: '3/4', sizeUnit: '"', label: 'צינור מרירון 3/4"', icon: 'linear-scale', category: 'conduits', unit: 'meter' },
  { id: 'conduitMariron_1', family: 'conduitMariron', familyLabel: 'צינור מרירון', size: '1', sizeUnit: '"', label: 'צינור מרירון 1"', icon: 'linear-scale', category: 'conduits', unit: 'meter' },
  { id: 'conduitMariron_1_5', family: 'conduitMariron', familyLabel: 'צינור מרירון', size: '1.5', sizeUnit: '"', label: 'צינור מרירון 1.5"', icon: 'linear-scale', category: 'conduits', unit: 'meter' },
  { id: 'conduitMariron_2', family: 'conduitMariron', familyLabel: 'צינור מרירון', size: '2', sizeUnit: '"', label: 'צינור מרירון 2"', icon: 'linear-scale', category: 'conduits', unit: 'meter' },

  // תעלת רשת (4 גדלים)
  { id: 'cableTray_100', family: 'cableTray', familyLabel: 'תעלת רשת', size: '100', label: 'תעלת רשת 100 מ"מ', icon: 'view-week', category: 'conduits', unit: 'meter' },
  { id: 'cableTray_200', family: 'cableTray', familyLabel: 'תעלת רשת', size: '200', label: 'תעלת רשת 200 מ"מ', icon: 'view-week', category: 'conduits', unit: 'meter' },
  { id: 'cableTray_300', family: 'cableTray', familyLabel: 'תעלת רשת', size: '300', label: 'תעלת רשת 300 מ"מ', icon: 'view-week', category: 'conduits', unit: 'meter' },
  { id: 'cableTray_400', family: 'cableTray', familyLabel: 'תעלת רשת', size: '400', label: 'תעלת רשת 400 מ"מ', icon: 'view-week', category: 'conduits', unit: 'meter' },

  // גדלים נוספים לצנרת
  { id: 'conduitMarichef_32', family: 'conduitMarichef', familyLabel: 'צינור מריכף', size: '32', label: 'צינור מריכף 32', icon: 'linear-scale', category: 'conduits', unit: 'meter' },
  { id: 'conduitShirshuri_25', family: 'conduitShirshuri', familyLabel: 'צינור שרשורי', size: '25', label: 'צינור שרשורי 25', icon: 'waves', category: 'conduits', unit: 'meter' },

  // תעלת פלסטיק (משפחה — תעלה לבנה על הקיר)
  { id: 'pvcTrunking_16x16', family: 'pvcTrunking', familyLabel: 'תעלת פלסטיק', size: '16×16', sizeUnit: ' מ״מ', label: 'תעלת פלסטיק 16×16 מ״מ', icon: 'view-stream', category: 'conduits', unit: 'meter' },
  { id: 'pvcTrunking_25x16', family: 'pvcTrunking', familyLabel: 'תעלת פלסטיק', size: '25×16', sizeUnit: ' מ״מ', label: 'תעלת פלסטיק 25×16 מ״מ', icon: 'view-stream', category: 'conduits', unit: 'meter' },
  { id: 'pvcTrunking_40x25', family: 'pvcTrunking', familyLabel: 'תעלת פלסטיק', size: '40×25', sizeUnit: ' מ״מ', label: 'תעלת פלסטיק 40×25 מ״מ', icon: 'view-stream', category: 'conduits', unit: 'meter' },
  { id: 'pvcTrunking_60x40', family: 'pvcTrunking', familyLabel: 'תעלת פלסטיק', size: '60×40', sizeUnit: ' מ״מ', label: 'תעלת פלסטיק 60×40 מ״מ', icon: 'view-stream', category: 'conduits', unit: 'meter' },

  // תפס לצינור (משפחה)
  { id: 'conduitClip_16', family: 'conduitClip', familyLabel: 'תפס לצינור', size: '16', label: 'תפס לצינור 16', icon: 'push-pin', category: 'conduits', unit: 'piece' },
  { id: 'conduitClip_20', family: 'conduitClip', familyLabel: 'תפס לצינור', size: '20', label: 'תפס לצינור 20', icon: 'push-pin', category: 'conduits', unit: 'piece' },
  { id: 'conduitClip_25', family: 'conduitClip', familyLabel: 'תפס לצינור', size: '25', label: 'תפס לצינור 25', icon: 'push-pin', category: 'conduits', unit: 'piece' },

  // אביזרי צנרת
  { id: 'conduitCoupler', label: 'מחבר לצינור (מופה)', icon: 'compare-arrows', category: 'conduits', unit: 'piece' },
  { id: 'conduitBend', label: 'קשת / זווית לצינור', icon: 'turn-right', category: 'conduits', unit: 'piece' },
  { id: 'conduitBoxConnector', label: 'מחבר צינור לקופסה', icon: 'input', category: 'conduits', unit: 'piece' },
  { id: 'trunkingAccessories', label: 'אביזרים לתעלה (זוויות, מכסי קצה)', icon: 'crop-free', category: 'conduits', unit: 'piece' },

  // ============ לוחות חשמל ============

  // לוח חד-פאזי (משפחה)
  { id: 'panel1ph_4', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '4', label: 'לוח חד-פאזי 4 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece', hidden: true },
  { id: 'panel1ph_6', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '6', label: 'לוח חד-פאזי 6 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece', hidden: true },
  { id: 'panel1ph_8', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '8', label: 'לוח חד-פאזי 8 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece', hidden: true },
  { id: 'panel1ph_12', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '12', label: 'לוח חד-פאזי 12 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece' },
  { id: 'panel1ph_24', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '24', label: 'לוח חד-פאזי 24 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece' },

  // לוח תלת-פאזי (משפחה)
  { id: 'panel3ph_12', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '12', label: 'לוח תלת-פאזי 12 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },
  { id: 'panel3ph_24', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '24', label: 'לוח תלת-פאזי 24 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },
  { id: 'panel3ph_36', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '36', label: 'לוח תלת-פאזי 36 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },
  { id: 'panel3ph_48', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '48', label: 'לוח תלת-פאזי 48 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },

  // לוחות אחרים
  { id: 'panelOutdoor', label: 'לוח חיצוני IP65', icon: 'shield', category: 'panels', unit: 'piece', hidden: true },
  { id: 'panelRail', label: 'פס DIN למודולים', icon: 'view-stream', category: 'panels', unit: 'piece', isMaterial: true },

  // ============ בטיחות והגנה ============

  // מפסק אוטומטי חד-פאזי (משפחה)
  { id: 'mcb1ph_10', family: 'mcb1ph', familyLabel: 'מפסק אוטומטי חד-פאזי', size: '10A', label: 'מפסק אוטומטי חד-פאזי 10A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb1ph_16', family: 'mcb1ph', familyLabel: 'מפסק אוטומטי חד-פאזי', size: '16A', label: 'מפסק אוטומטי חד-פאזי 16A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb1ph_20', family: 'mcb1ph', familyLabel: 'מפסק אוטומטי חד-פאזי', size: '20A', label: 'מפסק אוטומטי חד-פאזי 20A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb1ph_25', family: 'mcb1ph', familyLabel: 'מפסק אוטומטי חד-פאזי', size: '25A', label: 'מפסק אוטומטי חד-פאזי 25A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb1ph_32', family: 'mcb1ph', familyLabel: 'מפסק אוטומטי חד-פאזי', size: '32A', label: 'מפסק אוטומטי חד-פאזי 32A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb1ph_40', family: 'mcb1ph', familyLabel: 'מפסק אוטומטי חד-פאזי', size: '40A', label: 'מפסק אוטומטי חד-פאזי 40A', icon: 'flash-on', category: 'safety', unit: 'piece' },

  // מפסק אוטומטי תלת-פאזי (משפחה)
  { id: 'mcb3ph_16', family: 'mcb3ph', familyLabel: 'מפסק אוטומטי תלת-פאזי', size: '16A', label: 'מפסק אוטומטי תלת-פאזי 16A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb3ph_25', family: 'mcb3ph', familyLabel: 'מפסק אוטומטי תלת-פאזי', size: '25A', label: 'מפסק אוטומטי תלת-פאזי 25A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb3ph_32', family: 'mcb3ph', familyLabel: 'מפסק אוטומטי תלת-פאזי', size: '32A', label: 'מפסק אוטומטי תלת-פאזי 32A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb3ph_40', family: 'mcb3ph', familyLabel: 'מפסק אוטומטי תלת-פאזי', size: '40A', label: 'מפסק אוטומטי תלת-פאזי 40A', icon: 'flash-on', category: 'safety', unit: 'piece' },
  { id: 'mcb3ph_63', family: 'mcb3ph', familyLabel: 'מפסק אוטומטי תלת-פאזי', size: '63A', label: 'מפסק אוטומטי תלת-פאזי 63A', icon: 'flash-on', category: 'safety', unit: 'piece' },

  // מפסק פחת משולב RCBO (משפחה)
  { id: 'rcbo_16', family: 'rcbo', familyLabel: 'מפסק פחת משולב (RCBO)', size: '16A', label: 'מפסק פחת משולב 16A', icon: 'security', category: 'safety', unit: 'piece', hidden: true },
  { id: 'rcbo_25', family: 'rcbo', familyLabel: 'מפסק פחת משולב (RCBO)', size: '25A', label: 'מפסק פחת משולב 25A', icon: 'security', category: 'safety', unit: 'piece', hidden: true },
  { id: 'rcbo_32', family: 'rcbo', familyLabel: 'מפסק פחת משולב (RCBO)', size: '32A', label: 'מפסק פחת משולב 32A', icon: 'security', category: 'safety', unit: 'piece', hidden: true },
  { id: 'rcbo_40', family: 'rcbo', familyLabel: 'מפסק פחת משולב (RCBO)', size: '40A', label: 'מפסק פחת משולב 40A', icon: 'security', category: 'safety', unit: 'piece' },

  // מגען / Contactor (משפחה)
  { id: 'contactor_25', family: 'contactor', familyLabel: 'מגען (Contactor)', size: '25A', label: 'מגען 25A', icon: 'electric-bolt', category: 'safety', unit: 'piece' },
  { id: 'contactor_32', family: 'contactor', familyLabel: 'מגען (Contactor)', size: '32A', label: 'מגען 32A', icon: 'electric-bolt', category: 'safety', unit: 'piece' },
  { id: 'contactor_40', family: 'contactor', familyLabel: 'מגען (Contactor)', size: '40A', label: 'מגען 40A', icon: 'electric-bolt', category: 'safety', unit: 'piece' },
  { id: 'contactor_63', family: 'contactor', familyLabel: 'מגען (Contactor)', size: '63A', label: 'מגען 63A', icon: 'electric-bolt', category: 'safety', unit: 'piece' },

  // הגנה ובקרה (פריטים בודדים)
  { id: 'rcd', label: 'מפסק פחת', icon: 'security', category: 'safety', unit: 'piece' },
  { id: 'mainBreaker', label: 'מפסק זרם ראשי', icon: 'power-settings-new', category: 'safety', unit: 'piece' },
  { id: 'voltageProtector', label: 'מגן מתח', icon: 'shield', category: 'safety', unit: 'piece' },
  { id: 'photocell', label: 'פוטוצל (חיישן יום-לילה) כולל התקנה', icon: 'wb-twilight', category: 'control', unit: 'piece' },
  { id: 'timeSwitch', label: 'טיימר תאורה', icon: 'timer', category: 'control', unit: 'piece', hidden: true },
  { id: 'sabbathTimer', label: 'שעון שבת', icon: 'schedule', category: 'control', unit: 'piece' },
  { id: 'surgeProtector', label: 'הגנת ברק (SPD)', icon: 'bolt', category: 'safety', unit: 'piece' },

  // ============ תקשורת ============
  { id: 'dataPoint', label: 'נקודת רשת CAT6', icon: 'router', category: 'comms', unit: 'point' },
  { id: 'dataPointCat7', label: 'נקודת רשת CAT7', icon: 'router', category: 'comms', unit: 'point' },
  { id: 'tvPoint', label: 'נקודת טלוויזיה', icon: 'tv', category: 'comms', unit: 'point', hidden: true },
  { id: 'intercomPoint', label: 'נקודת אינטרקום', icon: 'phone', category: 'comms', unit: 'point' },
  { id: 'speakerPoint', label: 'נקודת רמקול', icon: 'speaker', category: 'comms', unit: 'point' },
  { id: 'cameraPoint', label: 'נקודת מצלמה (CCTV)', icon: 'videocam', category: 'comms', unit: 'point' },
  { id: 'doorbellPoint', label: 'נקודת פעמון/אינטרקום', icon: 'doorbell', category: 'comms', unit: 'point' },
  { id: 'cableCat6', label: 'כבל רשת CAT6', icon: 'settings-ethernet', category: 'comms', unit: 'meter', isMaterial: true },
  { id: 'cableCat7', label: 'כבל רשת CAT7', icon: 'settings-ethernet', category: 'comms', unit: 'meter', isMaterial: true },
  { id: 'cableCoax', label: 'כבל קואקסיאלי', icon: 'settings-input-antenna', category: 'comms', unit: 'meter', isMaterial: true },
  { id: 'cableHdmi', label: 'כבל HDMI (לפי מטר)', icon: 'settings-input-hdmi', category: 'comms', unit: 'meter' },

  // ============ קופסאות ============

  // קופסת בטון (משפחה — לקירות בטון)
  { id: 'concreteBox_3', family: 'concreteBox', familyLabel: 'קופסת בטון', size: '3', label: 'קופסת בטון 3 מקומות', icon: 'crop-square', category: 'boxes', unit: 'piece' },
  { id: 'concreteBox_4', family: 'concreteBox', familyLabel: 'קופסת בטון', size: '4', label: 'קופסת בטון 4 מקומות', icon: 'crop-square', category: 'boxes', unit: 'piece' },
  { id: 'concreteBox_6', family: 'concreteBox', familyLabel: 'קופסת בטון', size: '6', label: 'קופסת בטון 6 מקומות', icon: 'crop-square', category: 'boxes', unit: 'piece' },

  // קופסת גבס (משפחה — לקירות גבס)
  { id: 'gypsumBox_3', family: 'gypsumBox', familyLabel: 'קופסת גבס', size: '3', label: 'קופסת גבס 3 מקומות', icon: 'crop-din', category: 'boxes', unit: 'piece' },
  { id: 'gypsumBox_4', family: 'gypsumBox', familyLabel: 'קופסת גבס', size: '4', label: 'קופסת גבס 4 מקומות', icon: 'crop-din', category: 'boxes', unit: 'piece' },
  { id: 'gypsumBox_5', family: 'gypsumBox', familyLabel: 'קופסת גבס', size: '5', label: 'קופסת גבס 5 מקומות', icon: 'crop-din', category: 'boxes', unit: 'piece' },

  // מסגרת (משפחה — מסגרות לאביזרי שקעים/מפסקים)
  { id: 'frame_1', family: 'frame', familyLabel: 'מסגרת', size: '1', label: 'מסגרת 1 מקום', icon: 'crop-free', category: 'frames', unit: 'piece' },
  { id: 'frame_2', family: 'frame', familyLabel: 'מסגרת', size: '2', label: 'מסגרת 2 מקומות', icon: 'crop-free', category: 'frames', unit: 'piece' },
  { id: 'frame_3', family: 'frame', familyLabel: 'מסגרת', size: '3', label: 'מסגרת 3 מקומות', icon: 'crop-free', category: 'frames', unit: 'piece' },
  { id: 'frame_4', family: 'frame', familyLabel: 'מסגרת', size: '4', label: 'מסגרת 4 מקומות', icon: 'crop-free', category: 'frames', unit: 'piece' },
  { id: 'frame_6', family: 'frame', familyLabel: 'מסגרת', size: '6', label: 'מסגרת 6 מקומות', icon: 'crop-free', category: 'frames', unit: 'piece' },

  // מתאמים לקופסאות חשמל (מתאם אחיד — מתאים גם לבטון וגם לגבס)
  { id: 'adapterConcrete_3', family: 'adapterConcrete', familyLabel: 'מתאם', size: '3', label: 'מתאם 3 מקומות', icon: 'extension', category: 'boxes', unit: 'piece' },
  { id: 'adapterConcrete_4', family: 'adapterConcrete', familyLabel: 'מתאם', size: '4', label: 'מתאם 4 מקומות', icon: 'extension', category: 'boxes', unit: 'piece' },
  { id: 'adapterConcrete_6', family: 'adapterConcrete', familyLabel: 'מתאם', size: '6', label: 'מתאם 6 מקומות', icon: 'extension', category: 'boxes', unit: 'piece' },

  // קופסאות אחרות
  { id: 'ceilingBox', label: 'קופסת תקרה (הסתעפות)', icon: 'crop-square', category: 'boxes', unit: 'piece' },
  { id: 'boxWaterproof', label: 'קופסת הסתעפות מוגנת מים (IP65)', icon: 'water-drop', category: 'boxes', unit: 'piece' },
  { id: 'boxSurface', label: 'קופסה חיצונית לאביזר (על הטיח)', icon: 'crop-square', category: 'boxes', unit: 'piece' },
  { id: 'boxCover', label: 'מכסה לקופסה', icon: 'check-box-outline-blank', category: 'boxes', unit: 'piece' },
  // קופסת אופיס (משפחה — עבודה ללקוח, לא חומר לספק)
  { id: 'officeFloorBox', family: 'officeFloorBox', familyLabel: 'קופסת אופיס', size: 'D16', sizeUnit: '', label: 'קופסת אופיס D16', icon: 'view-quilt', category: 'outlets', unit: 'piece' },
  { id: 'officeFloorBox_d17', family: 'officeFloorBox', familyLabel: 'קופסת אופיס', size: 'D17', sizeUnit: '', label: 'קופסת אופיס D17', icon: 'view-quilt', category: 'outlets', unit: 'piece' },
  { id: 'officeFloorBox_d18', family: 'officeFloorBox', familyLabel: 'קופסת אופיס', size: 'D18', sizeUnit: '', label: 'קופסת אופיס D18', icon: 'view-quilt', category: 'outlets', unit: 'piece' },

  // ============ אביזרים נוספים (חשמלאי) ============
  { id: 'smokeDetector', label: 'גלאי עשן', icon: 'sensors', category: 'misc', unit: 'piece', professions: ['electrician'] },

  // ============ 📦 חומרים לספק — חשמלאי ============
  // הקטגוריות האלה לא מופיעות בהצעה ללקוח — רק ברשימת החומרים לספק.

  // 📦 אביזרי שקעים ומפסקים
  { id: 'devOutlet', label: 'שקע חשמל', icon: 'power', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devOutletDouble', label: 'שקע כפול', icon: 'power', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devOutletWaterproof', label: 'שקע מוגן מים (IP44)', icon: 'water-drop', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devOutlet16a', label: 'שקע 16A (מזגן / תנור)', icon: 'power', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devOutletUsb', label: 'שקע USB', icon: 'usb', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devSwitch', label: 'מפסק יחיד', icon: 'toggle-on', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devSwitchDouble', label: 'מפסק כפול', icon: 'toggle-on', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devSwitch2way', label: 'מפסק מחליף', icon: 'swap-horiz', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devSwitchCross', label: 'מפסק צלב', icon: 'shuffle', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devPushButton', label: 'לחצן (פעמון / מדרגות)', icon: 'radio-button-checked', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devBoilerSwitch', label: 'מפסק דוד 20A עם נורית', icon: 'hot-tub', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devBoilerTimer', label: 'מפסק זמן לדוד (טיימר)', icon: 'timer', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devShutterSwitch', label: 'מפסק תריס חשמלי', icon: 'blinds', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devDimmer', label: 'דימר LED', icon: 'brightness-6', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devSwitchWaterproof', label: 'מפסק מוגן מים', icon: 'water-drop', category: 'elecMatDevices', unit: 'piece' },
  { id: 'devBlankCover', label: 'מכסה עיוור', icon: 'check-box-outline-blank', category: 'elecMatDevices', unit: 'piece' },

  // 📦 ציוד ללוח חשמל
  // מאמ״ת חד-קוטבי (משפחה)
  { id: 'mcbMat1p_10', family: 'mcbMat1p', familyLabel: 'מאמ״ת חד-קוטבי', size: '10', sizeUnit: 'A', label: 'מאמ״ת 1×10A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat1p_16', family: 'mcbMat1p', familyLabel: 'מאמ״ת חד-קוטבי', size: '16', sizeUnit: 'A', label: 'מאמ״ת 1×16A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat1p_20', family: 'mcbMat1p', familyLabel: 'מאמ״ת חד-קוטבי', size: '20', sizeUnit: 'A', label: 'מאמ״ת 1×20A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat1p_25', family: 'mcbMat1p', familyLabel: 'מאמ״ת חד-קוטבי', size: '25', sizeUnit: 'A', label: 'מאמ״ת 1×25A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat1p_32', family: 'mcbMat1p', familyLabel: 'מאמ״ת חד-קוטבי', size: '32', sizeUnit: 'A', label: 'מאמ״ת 1×32A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat1p_40', family: 'mcbMat1p', familyLabel: 'מאמ״ת חד-קוטבי', size: '40', sizeUnit: 'A', label: 'מאמ״ת 1×40A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  // מאמ״ת תלת-קוטבי (משפחה)
  { id: 'mcbMat3p_16', family: 'mcbMat3p', familyLabel: 'מאמ״ת תלת-קוטבי', size: '16', sizeUnit: 'A', label: 'מאמ״ת 3×16A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat3p_20', family: 'mcbMat3p', familyLabel: 'מאמ״ת תלת-קוטבי', size: '20', sizeUnit: 'A', label: 'מאמ״ת 3×20A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat3p_25', family: 'mcbMat3p', familyLabel: 'מאמ״ת תלת-קוטבי', size: '25', sizeUnit: 'A', label: 'מאמ״ת 3×25A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat3p_32', family: 'mcbMat3p', familyLabel: 'מאמ״ת תלת-קוטבי', size: '32', sizeUnit: 'A', label: 'מאמ״ת 3×32A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat3p_40', family: 'mcbMat3p', familyLabel: 'מאמ״ת תלת-קוטבי', size: '40', sizeUnit: 'A', label: 'מאמ״ת 3×40A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat3p_50', family: 'mcbMat3p', familyLabel: 'מאמ״ת תלת-קוטבי', size: '50', sizeUnit: 'A', label: 'מאמ״ת 3×50A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mcbMat3p_63', family: 'mcbMat3p', familyLabel: 'מאמ״ת תלת-קוטבי', size: '63', sizeUnit: 'A', label: 'מאמ״ת 3×63A', icon: 'electric-bolt', category: 'elecMatPanel', unit: 'piece' },
  // ממסר פחת (משפחה)
  { id: 'rcdMat_2p40', family: 'rcdMat', familyLabel: 'ממסר פחת 30mA', size: '2P 40A', sizeUnit: '', label: 'ממסר פחת 2P 40A 30mA', icon: 'gpp-good', category: 'elecMatPanel', unit: 'piece' },
  { id: 'rcdMat_4p40', family: 'rcdMat', familyLabel: 'ממסר פחת 30mA', size: '4P 40A', sizeUnit: '', label: 'ממסר פחת 4P 40A 30mA', icon: 'gpp-good', category: 'elecMatPanel', unit: 'piece' },
  { id: 'rcdMat_4p63', family: 'rcdMat', familyLabel: 'ממסר פחת 30mA', size: '4P 63A', sizeUnit: '', label: 'ממסר פחת 4P 63A 30mA', icon: 'gpp-good', category: 'elecMatPanel', unit: 'piece' },
  { id: 'rcboMat_16', label: 'מאמ״ת פחת משולב (RCBO) 16A', icon: 'gpp-good', category: 'elecMatPanel', unit: 'piece' },
  // מפסק ראשי / מנתק (משפחה)
  { id: 'mainSwitchMat_40', family: 'mainSwitchMat', familyLabel: 'מפסק ראשי (מנתק)', size: '3×40', sizeUnit: 'A', label: 'מפסק ראשי 3×40A', icon: 'power-settings-new', category: 'elecMatPanel', unit: 'piece' },
  { id: 'mainSwitchMat_63', family: 'mainSwitchMat', familyLabel: 'מפסק ראשי (מנתק)', size: '3×63', sizeUnit: 'A', label: 'מפסק ראשי 3×63A', icon: 'power-settings-new', category: 'elecMatPanel', unit: 'piece' },
  // ארגז ללוח (משפחה — לפי מספר מודולים)
  { id: 'enclosure_12', family: 'enclosure', familyLabel: 'ארגז ללוח חשמל', size: '12', sizeUnit: ' מודולים', label: 'ארגז ללוח 12 מודולים', icon: 'dashboard', category: 'elecMatPanel', unit: 'piece' },
  { id: 'enclosure_24', family: 'enclosure', familyLabel: 'ארגז ללוח חשמל', size: '24', sizeUnit: ' מודולים', label: 'ארגז ללוח 24 מודולים', icon: 'dashboard', category: 'elecMatPanel', unit: 'piece' },
  { id: 'enclosure_36', family: 'enclosure', familyLabel: 'ארגז ללוח חשמל', size: '36', sizeUnit: ' מודולים', label: 'ארגז ללוח 36 מודולים', icon: 'dashboard', category: 'elecMatPanel', unit: 'piece' },
  { id: 'enclosure_48', family: 'enclosure', familyLabel: 'ארגז ללוח חשמל', size: '48', sizeUnit: ' מודולים', label: 'ארגז ללוח 48 מודולים', icon: 'dashboard', category: 'elecMatPanel', unit: 'piece' },
  // ציוד נוסף ללוח
  { id: 'contactorMat_25', label: 'מגען 25A', icon: 'settings-power', category: 'elecMatPanel', unit: 'piece' },
  { id: 'stepRelay', label: 'ממסר צעד (אימפולס)', icon: 'repeat', category: 'elecMatPanel', unit: 'piece' },
  { id: 'shabbatClock', label: 'שעון שבת דיגיטלי', icon: 'schedule', category: 'elecMatPanel', unit: 'piece' },
  { id: 'spdMat', label: 'מגן ברקים (SPD)', icon: 'flash-on', category: 'elecMatPanel', unit: 'piece' },
  { id: 'busbar1ph', label: 'פס צבירה (מסרק) חד-פאזי', icon: 'view-column', category: 'elecMatPanel', unit: 'piece' },
  { id: 'busbar3ph', label: 'פס צבירה (מסרק) תלת-פאזי', icon: 'view-column', category: 'elecMatPanel', unit: 'piece' },
  { id: 'neutralBar', label: 'פס אפס', icon: 'linear-scale', category: 'elecMatPanel', unit: 'piece' },
  { id: 'groundBar', label: 'פס הארקה', icon: 'linear-scale', category: 'elecMatPanel', unit: 'piece' },
  { id: 'blankModule', label: 'מכסה עיוור למודולים', icon: 'check-box-outline-blank', category: 'elecMatPanel', unit: 'piece' },

  // 📦 גופי תאורה ונורות
  { id: 'lightSpotLed', label: 'ספוט LED שקוע', icon: 'highlight', category: 'elecMatLighting', unit: 'piece' },
  { id: 'lightWaterproof', label: 'גוף תאורה מוגן מים (IP65)', icon: 'water-drop', category: 'elecMatLighting', unit: 'piece' },
  { id: 'lightStrip', label: 'פס LED', icon: 'linear-scale', category: 'elecMatLighting', unit: 'meter' },
  { id: 'lightStripDriver', label: 'ספק כוח לפס LED', icon: 'power', category: 'elecMatLighting', unit: 'piece' },
  { id: 'lampHolderE27', label: 'בית נורה E27', icon: 'lightbulb-outline', category: 'elecMatLighting', unit: 'piece' },
  { id: 'lightEmergency', label: 'תאורת חירום', icon: 'emergency', category: 'elecMatLighting', unit: 'piece' },
  { id: 'lightMotionSensor', label: 'גלאי תנועה לתאורה', icon: 'sensors', category: 'elecMatLighting', unit: 'piece' },
  { id: 'lightTwilightSwitch', label: 'מפסק דמדומים', icon: 'wb-twilight', category: 'elecMatLighting', unit: 'piece' },

  // 📦 מהדקים, חיבורים והארקה
  // מהדק WAGO (משפחה — לפי מספר חיבורים)
  { id: 'wago_2', family: 'wago', familyLabel: 'מהדק מהיר (WAGO)', size: '2', sizeUnit: ' חיבורים', label: 'מהדק WAGO ל-2 חיבורים', icon: 'settings-input-component', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'wago_3', family: 'wago', familyLabel: 'מהדק מהיר (WAGO)', size: '3', sizeUnit: ' חיבורים', label: 'מהדק WAGO ל-3 חיבורים', icon: 'settings-input-component', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'wago_5', family: 'wago', familyLabel: 'מהדק מהיר (WAGO)', size: '5', sizeUnit: ' חיבורים', label: 'מהדק WAGO ל-5 חיבורים', icon: 'settings-input-component', category: 'elecMatConnectors', unit: 'piece' },
  // נעל כבל (משפחה — לפי חתך)
  { id: 'cableLug_16', family: 'cableLug', familyLabel: 'נעל כבל', size: '16', sizeUnit: ' mm²', label: 'נעל כבל 16 mm²', icon: 'link', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'cableLug_25', family: 'cableLug', familyLabel: 'נעל כבל', size: '25', sizeUnit: ' mm²', label: 'נעל כבל 25 mm²', icon: 'link', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'cableLug_35', family: 'cableLug', familyLabel: 'נעל כבל', size: '35', sizeUnit: ' mm²', label: 'נעל כבל 35 mm²', icon: 'link', category: 'elecMatConnectors', unit: 'piece' },
  // אנטיגרון (משפחה)
  { id: 'cableGland_m16', family: 'cableGland', familyLabel: 'אנטיגרון', size: 'M16', sizeUnit: '', label: 'אנטיגרון M16', icon: 'adjust', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'cableGland_m20', family: 'cableGland', familyLabel: 'אנטיגרון', size: 'M20', sizeUnit: '', label: 'אנטיגרון M20', icon: 'adjust', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'cableGland_m25', family: 'cableGland', familyLabel: 'אנטיגרון', size: 'M25', sizeUnit: '', label: 'אנטיגרון M25', icon: 'adjust', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'terminalStrip', label: 'פס מהדקים (שוקולד)', icon: 'view-column', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'ferrules', label: 'שרוולי קצה לחוט (חבילה)', icon: 'inventory-2', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'heatShrink', label: 'שרוול מתכווץ (חבילה)', icon: 'inventory-2', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'groundRod', label: 'אלקטרודת הארקה (מוט)', icon: 'vertical-align-bottom', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'groundClamp', label: 'שלת הארקה לצינור', icon: 'link', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'potentialBar', label: 'פס השוואת פוטנציאלים', icon: 'linear-scale', category: 'elecMatConnectors', unit: 'piece' },
  { id: 'groundStrip', label: 'פס ברזל מגולוון (הארקת יסוד)', icon: 'linear-scale', category: 'elecMatConnectors', unit: 'meter' },

  // 📦 ברגים, דיבלים ומתכלים
  { id: 'electricalTape', label: 'בידוד (סלוטייפ חשמלאי)', icon: 'colorize', category: 'elecMatConsumables', unit: 'piece' },
  { id: 'cableTie', label: 'אזיקון/חבק (חבילה)', icon: 'link', category: 'elecMatConsumables', unit: 'piece' },
  { id: 'screwsAnchors', label: 'ברגים ודיבלים (חבילה)', icon: 'hardware', category: 'elecMatConsumables', unit: 'piece' },
  { id: 'butterflyAnchor', label: 'דיבל פרפר לגבס (חבילה)', icon: 'hardware', category: 'elecMatConsumables', unit: 'piece' },
  { id: 'boxScrews', label: 'ברגים לקופסאות (חבילה)', icon: 'hardware', category: 'elecMatConsumables', unit: 'piece' },
  { id: 'cableClips', label: 'מסמרי תפס לכבל (חבילה)', icon: 'push-pin', category: 'elecMatConsumables', unit: 'piece' },
  { id: 'quickPlaster', label: 'גבס מהיר (שק)', icon: 'inventory', category: 'elecMatConsumables', unit: 'piece' },
  { id: 'pullCord', label: 'חוט משיכה (גליל)', icon: 'gesture', category: 'elecMatConsumables', unit: 'piece' },

  // ============ חשמלאי — בית חכם וטכנולוגיה (חדש) ============
  { id: 'smartSwitchShelly', label: 'מודול חכם Shelly 1', icon: 'smart-toy', category: 'smartHome', unit: 'piece', hidden: true },
  { id: 'smartSwitchShelly2', label: 'מודול חכם Shelly 2.5 (תריס)', icon: 'smart-toy', category: 'smartHome', unit: 'piece', hidden: true },
  { id: 'smartSocketSonoff', label: 'שקע חכם Sonoff', icon: 'smart-toy', category: 'smartHome', unit: 'piece', hidden: true },
  { id: 'smartLockYale', label: 'מנעול חכם דלת', icon: 'lock', category: 'smartHome', unit: 'piece', hidden: true },
  { id: 'evCharger7kw', label: 'עמדת טעינה לרכב חשמלי 7kW', icon: 'ev-station', category: 'energy', unit: 'piece' },
  { id: 'evCharger22kw', label: 'עמדת טעינה לרכב חשמלי 22kW', icon: 'ev-station', category: 'energy', unit: 'piece' },
  // פקט למזגן (משפחה — לפי עובי כבל, עד 10 מ׳)
  { id: 'acPoint', family: 'acPoint', familyLabel: 'פקט למזגן (עד 10 מ׳)', size: '5×2.5', sizeUnit: ' mm²', label: 'פקט למזגן כבל 5×2.5 עד 10 מ׳', icon: 'ac-unit', category: 'outlets', unit: 'point' },
  { id: 'acPoint_5x4', family: 'acPoint', familyLabel: 'פקט למזגן (עד 10 מ׳)', size: '5×4', sizeUnit: ' mm²', label: 'פקט למזגן כבל 5×4 עד 10 מ׳', icon: 'ac-unit', category: 'outlets', unit: 'point' },
  { id: 'acPoint_5x6', family: 'acPoint', familyLabel: 'פקט למזגן (עד 10 מ׳)', size: '5×6', sizeUnit: ' mm²', label: 'פקט למזגן כבל 5×6 עד 10 מ׳', icon: 'ac-unit', category: 'outlets', unit: 'point' },
  { id: 'solarInverter5kw', label: 'אינוורטר סולארי 5kW', icon: 'solar-power', category: 'energy', unit: 'piece', hidden: true },
  { id: 'solarPanel400w', label: 'פאנל סולארי 400W', icon: 'solar-power', category: 'energy', unit: 'piece', hidden: true },
  { id: 'floorHeatingPad', label: 'יריעת חימום רצפה חשמלית', icon: 'thermostat', category: 'energy', unit: 'meter', hidden: true },
  { id: 'floorHeatingThermo', label: 'תרמוסטט חימום רצפה', icon: 'thermostat', category: 'energy', unit: 'piece' },

  // ============================================================
  // ============ אינסטלטור ============
  // תמחור לפי עבודה (נקודה / התקנה / קריאה) — כמו "נקודת מאור" אצל חשמלאי.
  // החומרים (צנרת, אביזרים) בקטגוריות 📦 ונכנסים רק לרשימת הספק.

  // נקודות מים וצנרת
  { id: 'plWaterPointCold', label: 'נקודת מים קרים', icon: 'water-drop', category: 'plumbWater', unit: 'point' },
  { id: 'plWaterPointHotCold', label: 'נקודת מים חמים וקרים', icon: 'water-drop', category: 'plumbWater', unit: 'point' },
  { id: 'plWaterPointAppliance', label: 'נקודת מים למכשיר (מדיח / כביסה / מקרר)', icon: 'local-laundry-service', category: 'plumbWater', unit: 'point' },
  { id: 'plWaterPointOutdoor', label: 'נקודת מים חוץ / גינה', icon: 'park', category: 'plumbWater', unit: 'point' },
  { id: 'plPipeRun', label: 'הנחת צנרת מים', icon: 'linear-scale', category: 'plumbWater', unit: 'meter' },
  { id: 'plRepipe_3', family: 'plRepipe', familyLabel: 'החלפת צנרת מים לדירה', size: '3', sizeUnit: ' חדרים', label: 'החלפת צנרת מים לדירת 3 חדרים', icon: 'home', category: 'plumbWater', unit: 'job' },
  { id: 'plRepipe_4', family: 'plRepipe', familyLabel: 'החלפת צנרת מים לדירה', size: '4', sizeUnit: ' חדרים', label: 'החלפת צנרת מים לדירת 4 חדרים', icon: 'home', category: 'plumbWater', unit: 'job' },
  { id: 'plRepipe_5', family: 'plRepipe', familyLabel: 'החלפת צנרת מים לדירה', size: '5', sizeUnit: ' חדרים', label: 'החלפת צנרת מים לדירת 5 חדרים', icon: 'home', category: 'plumbWater', unit: 'job' },
  { id: 'plManifold', label: 'התקנת מחלק מים (קולקטור)', icon: 'view-module', category: 'plumbWater', unit: 'piece' },
  { id: 'plMainValve', label: 'התקנת ברז ראשי', icon: 'power-settings-new', category: 'plumbWater', unit: 'piece' },
  { id: 'plBackflow', label: 'התקנת מז״ח (מונע זרימה חוזרת)', icon: 'sync-alt', category: 'plumbWater', unit: 'piece' },
  { id: 'plPressureReducer', label: 'התקנת מקטין לחץ', icon: 'compress', category: 'plumbWater', unit: 'piece' },
  { id: 'plBoosterPump', label: 'התקנת משאבת לחץ (בוסטר)', icon: 'speed', category: 'plumbWater', unit: 'piece' },
  { id: 'plWaterFilter', label: 'התקנת מערכת סינון / בר מים', icon: 'opacity', category: 'plumbWater', unit: 'piece' },

  // ניקוז וביוב
  { id: 'plDrainPoint', label: 'נקודת ניקוז (כיור / מקלחת / מכונה)', icon: 'waves', category: 'plumbDrain', unit: 'point' },
  { id: 'plToiletDrainPoint', label: 'נקודת ביוב לאסלה', icon: 'wc', category: 'plumbDrain', unit: 'point' },
  { id: 'plAcDrainPoint', label: 'נקודת ניקוז למזגן', icon: 'ac-unit', category: 'plumbDrain', unit: 'point' },
  { id: 'plFloorDrain', label: 'התקנת מחסום רצפה', icon: 'circle', category: 'plumbDrain', unit: 'piece' },
  { id: 'plLinearDrain', label: 'התקנת תעלת ניקוז לינארית', icon: 'view-stream', category: 'plumbDrain', unit: 'piece' },
  { id: 'plSewerRun', label: 'הנחת צנרת ביוב', icon: 'linear-scale', category: 'plumbDrain', unit: 'meter' },
  { id: 'plManhole', label: 'בנייה / החלפת שוחת ביקורת', icon: 'radio-button-checked', category: 'plumbDrain', unit: 'piece' },

  // התקנת כלים סניטריים (הכלים בדרך כלל של הלקוח)
  { id: 'plToiletInstall', label: 'התקנת אסלה (מונובלוק)', icon: 'wc', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plWallToiletInstall', label: 'התקנת אסלה תלויה + מיכל סמוי', icon: 'wc', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plBasinInstall', label: 'התקנת כיור רחצה', icon: 'water-drop', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plVanityInstall', label: 'התקנת ארון אמבטיה עם כיור', icon: 'inventory-2', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plKitchenSinkInstall', label: 'התקנת כיור מטבח (כולל סיפון)', icon: 'kitchen', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plBathtubInstall', label: 'התקנת אמבטיה', icon: 'bathtub', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plShowerTrayInstall', label: 'התקנת אגנית מקלחת', icon: 'shower', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plBidetInstall', label: 'התקנת בידה / שטפון לאסלה', icon: 'shower', category: 'plumbSanitary', unit: 'piece' },
  { id: 'plSanitaryRemoval', label: 'פירוק כלי סניטרי קיים', icon: 'delete-sweep', category: 'plumbSanitary', unit: 'piece' },

  // ברזים ומערבלים
  { id: 'plKitchenFaucet', label: 'התקנת ברז מטבח', icon: 'kitchen', category: 'plumbFaucets', unit: 'piece' },
  { id: 'plBasinFaucet', label: 'התקנת ברז כיור רחצה', icon: 'water-drop', category: 'plumbFaucets', unit: 'piece' },
  { id: 'plShowerMixer', label: 'התקנת סוללה למקלחת / אמבטיה', icon: 'shower', category: 'plumbFaucets', unit: 'piece' },
  { id: 'plConcealedMixer', label: 'התקנת אינטרפוץ (מערבל סמוי)', icon: 'tune', category: 'plumbFaucets', unit: 'piece' },
  { id: 'plShowerSet', label: 'התקנת מוט / ראש מקלחת', icon: 'shower', category: 'plumbFaucets', unit: 'piece' },
  { id: 'plAngleValve', label: 'החלפת ברז ניל (זווית)', icon: 'radio-button-checked', category: 'plumbFaucets', unit: 'piece' },
  { id: 'plGardenFaucet', label: 'התקנת ברז גינה', icon: 'park', category: 'plumbFaucets', unit: 'piece' },
  { id: 'plCartridgeReplace', label: 'החלפת מחסנית / קרמיקה בברז', icon: 'settings', category: 'plumbFaucets', unit: 'piece' },

  // דודים וחימום מים
  { id: 'plBoilerInstall', label: 'התקנת דוד חשמלי', icon: 'hot-tub', category: 'plumbHeating', unit: 'piece' },
  { id: 'plBoilerReplace', label: 'החלפת דוד (פירוק ישן + התקנת חדש)', icon: 'hot-tub', category: 'plumbHeating', unit: 'piece' },
  { id: 'plSolarSystem', label: 'התקנת מערכת סולארית (דוד + קולטים)', icon: 'wb-sunny', category: 'plumbHeating', unit: 'job' },
  { id: 'plSolarCollector', label: 'החלפת קולט סולארי', icon: 'solar-power', category: 'plumbHeating', unit: 'piece' },
  { id: 'plHeatingElement', label: 'החלפת גוף חימום', icon: 'flash-on', category: 'plumbHeating', unit: 'piece' },
  { id: 'plBoilerThermostat', label: 'החלפת תרמוסטט לדוד', icon: 'thermostat', category: 'plumbHeating', unit: 'piece' },
  { id: 'plBoilerSafetyValve', label: 'החלפת שסתום ביטחון לדוד', icon: 'shield', category: 'plumbHeating', unit: 'piece' },
  { id: 'plBoilerDescale', label: 'ניקוי אבנית בדוד', icon: 'cleaning-services', category: 'plumbHeating', unit: 'piece' },
  { id: 'plCirculationPump', label: 'התקנת משאבת סחרור (מים חמים)', icon: 'autorenew', category: 'plumbHeating', unit: 'piece' },
  { id: 'plInstantHeater', label: 'התקנת מחמם מים מיידי', icon: 'bolt', category: 'plumbHeating', unit: 'piece' },

  // שירות, סתימות ונזילות
  { id: 'plServiceCall', label: 'קריאת שירות', icon: 'support-agent', category: 'plumbService', unit: 'job' },
  { id: 'plWorkHour', label: 'שעת עבודה', icon: 'schedule', category: 'plumbService', unit: 'hour' },
  { id: 'plUnclog', label: 'פתיחת סתימה', icon: 'build', category: 'plumbService', unit: 'job' },
  { id: 'plUnclogMachine', label: 'פתיחת סתימה במכונה (ספירלה)', icon: 'build', category: 'plumbService', unit: 'job' },
  { id: 'plUnclogMain', label: 'פתיחת סתימה בקו ראשי / שוחה', icon: 'build', category: 'plumbService', unit: 'job' },
  { id: 'plLeakDetection', label: 'איתור נזילה (מכשור אקוסטי / תרמי)', icon: 'search', category: 'plumbService', unit: 'job' },
  { id: 'plSewerCamera', label: 'צילום קו ביוב במצלמה', icon: 'videocam', category: 'plumbService', unit: 'job' },
  { id: 'plLeakRepair', label: 'תיקון נזילה', icon: 'healing', category: 'plumbService', unit: 'job' },
  { id: 'plFlushMechanism', label: 'החלפת מנגנון הדחה', icon: 'wc', category: 'plumbService', unit: 'piece' },
  { id: 'plToiletSeat', label: 'החלפת מושב אסלה', icon: 'wc', category: 'plumbService', unit: 'piece' },

  // 📦 צנרת ואביזרי מים
  { id: 'plMatPex_16', family: 'plMatPex', familyLabel: 'צינור פקסגול (PEX)', size: '16', sizeUnit: ' מ״מ', label: 'צינור פקסגול 16 מ״מ', icon: 'linear-scale', category: 'plumbMatWater', unit: 'meter' },
  { id: 'plMatPex_20', family: 'plMatPex', familyLabel: 'צינור פקסגול (PEX)', size: '20', sizeUnit: ' מ״מ', label: 'צינור פקסגול 20 מ״מ', icon: 'linear-scale', category: 'plumbMatWater', unit: 'meter' },
  { id: 'plMatPex_25', family: 'plMatPex', familyLabel: 'צינור פקסגול (PEX)', size: '25', sizeUnit: ' מ״מ', label: 'צינור פקסגול 25 מ״מ', icon: 'linear-scale', category: 'plumbMatWater', unit: 'meter' },
  { id: 'plMatPex_32', family: 'plMatPex', familyLabel: 'צינור פקסגול (PEX)', size: '32', sizeUnit: ' מ״מ', label: 'צינור פקסגול 32 מ״מ', icon: 'linear-scale', category: 'plumbMatWater', unit: 'meter' },
  { id: 'plMatPexElbow_16', family: 'plMatPexElbow', familyLabel: 'זווית פקסגול', size: '16', sizeUnit: ' מ״מ', label: 'זווית פקסגול 16 מ״מ', icon: 'turn-right', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatPexElbow_20', family: 'plMatPexElbow', familyLabel: 'זווית פקסגול', size: '20', sizeUnit: ' מ״מ', label: 'זווית פקסגול 20 מ״מ', icon: 'turn-right', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatPexElbow_25', family: 'plMatPexElbow', familyLabel: 'זווית פקסגול', size: '25', sizeUnit: ' מ״מ', label: 'זווית פקסגול 25 מ״מ', icon: 'turn-right', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatPexTee_16', family: 'plMatPexTee', familyLabel: 'מסעף T פקסגול', size: '16', sizeUnit: ' מ״מ', label: 'מסעף T פקסגול 16 מ״מ', icon: 'call-split', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatPexTee_20', family: 'plMatPexTee', familyLabel: 'מסעף T פקסגול', size: '20', sizeUnit: ' מ״מ', label: 'מסעף T פקסגול 20 מ״מ', icon: 'call-split', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatPexTee_25', family: 'plMatPexTee', familyLabel: 'מסעף T פקסגול', size: '25', sizeUnit: ' מ״מ', label: 'מסעף T פקסגול 25 מ״מ', icon: 'call-split', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatPexAdapter', label: 'מתאם הברגה לפקסגול', icon: 'compare-arrows', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatBallValve_12', family: 'plMatBallValve', familyLabel: 'ברז כדורי', size: '1/2', sizeUnit: '"', label: 'ברז כדורי 1/2"', icon: 'radio-button-checked', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatBallValve_34', family: 'plMatBallValve', familyLabel: 'ברז כדורי', size: '3/4', sizeUnit: '"', label: 'ברז כדורי 3/4"', icon: 'radio-button-checked', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatBallValve_1', family: 'plMatBallValve', familyLabel: 'ברז כדורי', size: '1', sizeUnit: '"', label: 'ברז כדורי 1"', icon: 'radio-button-checked', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatAngleValve', label: 'ברז ניל (זווית) 1/2"', icon: 'radio-button-checked', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatFlex_30', family: 'plMatFlex', familyLabel: 'צינור גמיש 1/2"', size: '30', sizeUnit: ' ס״מ', label: 'צינור גמיש 1/2" 30 ס״מ', icon: 'gesture', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatFlex_40', family: 'plMatFlex', familyLabel: 'צינור גמיש 1/2"', size: '40', sizeUnit: ' ס״מ', label: 'צינור גמיש 1/2" 40 ס״מ', icon: 'gesture', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatFlex_60', family: 'plMatFlex', familyLabel: 'צינור גמיש 1/2"', size: '60', sizeUnit: ' ס״מ', label: 'צינור גמיש 1/2" 60 ס״מ', icon: 'gesture', category: 'plumbMatWater', unit: 'piece' },
  { id: 'plMatPipeInsulation', label: 'בידוד לצנרת', icon: 'view-stream', category: 'plumbMatWater', unit: 'meter' },

  // 📦 צנרת ואביזרי ביוב
  { id: 'plMatSewerPipe_50', family: 'plMatSewerPipe', familyLabel: 'צינור ביוב', size: '50', sizeUnit: ' מ״מ', label: 'צינור ביוב 50 מ״מ', icon: 'linear-scale', category: 'plumbMatDrain', unit: 'meter' },
  { id: 'plMatSewerPipe_75', family: 'plMatSewerPipe', familyLabel: 'צינור ביוב', size: '75', sizeUnit: ' מ״מ', label: 'צינור ביוב 75 מ״מ', icon: 'linear-scale', category: 'plumbMatDrain', unit: 'meter' },
  { id: 'plMatSewerPipe_110', family: 'plMatSewerPipe', familyLabel: 'צינור ביוב', size: '110', sizeUnit: ' מ״מ', label: 'צינור ביוב 110 מ״מ', icon: 'linear-scale', category: 'plumbMatDrain', unit: 'meter' },
  { id: 'plMatSewerElbow_50', family: 'plMatSewerElbow', familyLabel: 'זווית ביוב', size: '50', sizeUnit: ' מ״מ', label: 'זווית ביוב 50 מ״מ', icon: 'turn-right', category: 'plumbMatDrain', unit: 'piece' },
  { id: 'plMatSewerElbow_110', family: 'plMatSewerElbow', familyLabel: 'זווית ביוב', size: '110', sizeUnit: ' מ״מ', label: 'זווית ביוב 110 מ״מ', icon: 'turn-right', category: 'plumbMatDrain', unit: 'piece' },
  { id: 'plMatSewerY_50', family: 'plMatSewerY', familyLabel: 'הסתעפות Y ביוב', size: '50', sizeUnit: ' מ״מ', label: 'הסתעפות Y ביוב 50 מ״מ', icon: 'call-split', category: 'plumbMatDrain', unit: 'piece' },
  { id: 'plMatSewerY_110', family: 'plMatSewerY', familyLabel: 'הסתעפות Y ביוב', size: '110', sizeUnit: ' מ״מ', label: 'הסתעפות Y ביוב 110 מ״מ', icon: 'call-split', category: 'plumbMatDrain', unit: 'piece' },
  { id: 'plMatFloorDrain', label: 'מחסום רצפה', icon: 'circle', category: 'plumbMatDrain', unit: 'piece' },
  { id: 'plMatSinkTrap', label: 'סיפון לכיור', icon: 'filter-list', category: 'plumbMatDrain', unit: 'piece' },
  { id: 'plMatToiletConnector', label: 'מחבר אסלה לביוב', icon: 'compare-arrows', category: 'plumbMatDrain', unit: 'piece' },

  // 📦 אטימה ומתכלים
  { id: 'plMatTeflon', label: 'סרט טפלון', icon: 'colorize', category: 'plumbMatGeneral', unit: 'piece' },
  { id: 'plMatHemp', label: 'פשתן + משחת אטימה', icon: 'colorize', category: 'plumbMatGeneral', unit: 'piece' },
  { id: 'plMatSilicone', label: 'סיליקון סניטרי', icon: 'colorize', category: 'plumbMatGeneral', unit: 'piece' },
  { id: 'plMatPvcGlue', label: 'דבק PVC', icon: 'colorize', category: 'plumbMatGeneral', unit: 'piece' },
  { id: 'plMatPipeClamps', label: 'תפסני צנרת (חבילה)', icon: 'link', category: 'plumbMatGeneral', unit: 'piece' },

  // ============================================================
  // ============ איש תקשורת ============
  // מחיר לנקודה / להתקנה (כולל ציוד וחיווט אם הוא מספק). את הציוד והכבלים
  // מזמינים מהקטגוריות 📦 — הם יוצאים ברשימת הספק בלבד.

  // נקודות תקשורת
  { id: 'cmDataCat6', label: 'נקודת רשת CAT6', icon: 'settings-ethernet', category: 'cmPoints', unit: 'point' },
  { id: 'cmDataCat6a', label: 'נקודת רשת CAT6A', icon: 'settings-ethernet', category: 'cmPoints', unit: 'point' },
  { id: 'cmTvPoint', label: 'נקודת טלוויזיה (קואקס)', icon: 'tv', category: 'cmPoints', unit: 'point' },
  { id: 'cmPhonePoint', label: 'נקודת טלפון', icon: 'phone', category: 'cmPoints', unit: 'point' },
  { id: 'cmHdmiPoint', label: 'נקודת HDMI (מסך–מקור)', icon: 'settings-input-hdmi', category: 'cmPoints', unit: 'point' },
  { id: 'cmCableRun', label: 'השחלת כבל בצנרת קיימת', icon: 'cable', category: 'cmPoints', unit: 'meter' },
  { id: 'cmSurfaceDuct', label: 'התקנת תעלה חיצונית', icon: 'linear-scale', category: 'cmPoints', unit: 'meter' },
  { id: 'cmFiberRun', label: 'הנחת סיב אופטי', icon: 'linear-scale', category: 'cmPoints', unit: 'meter' },
  { id: 'cmFiberSplice', label: 'ריתוך סיב אופטי', icon: 'flash-on', category: 'cmPoints', unit: 'piece' },
  { id: 'cmPointCert', label: 'בדיקה והסמכת נקודה (כולל דו״ח)', icon: 'verified', category: 'cmPoints', unit: 'point' },

  // ארון תקשורת ותשתית
  { id: 'cmRackInstall_6', family: 'cmRackInstall', familyLabel: 'התקנת ארון תקשורת', size: '6U', sizeUnit: '', label: 'התקנת ארון תקשורת 6U', icon: 'dns', category: 'cmRack', unit: 'piece' },
  { id: 'cmRackInstall_9', family: 'cmRackInstall', familyLabel: 'התקנת ארון תקשורת', size: '9U', sizeUnit: '', label: 'התקנת ארון תקשורת 9U', icon: 'dns', category: 'cmRack', unit: 'piece' },
  { id: 'cmRackInstall_12', family: 'cmRackInstall', familyLabel: 'התקנת ארון תקשורת', size: '12U', sizeUnit: '', label: 'התקנת ארון תקשורת 12U', icon: 'dns', category: 'cmRack', unit: 'piece' },
  { id: 'cmRackInstall_22', family: 'cmRackInstall', familyLabel: 'התקנת ארון תקשורת', size: '22U', sizeUnit: '', label: 'התקנת ארון תקשורת 22U', icon: 'dns', category: 'cmRack', unit: 'piece' },
  { id: 'cmPatchPanelInstall', label: 'התקנת פאנל ניתוב', icon: 'view-module', category: 'cmRack', unit: 'piece' },
  { id: 'cmRackOrganize', label: 'סידור וארגון ארון קיים', icon: 'cleaning-services', category: 'cmRack', unit: 'job' },
  { id: 'cmUpsInstall', label: 'התקנת אל-פסק (UPS)', icon: 'battery-charging-full', category: 'cmRack', unit: 'piece' },
  { id: 'cmPduInstall', label: 'התקנת פס שקעים לארון', icon: 'power', category: 'cmRack', unit: 'piece' },

  // ציוד רשת ו-WiFi
  { id: 'cmSwitchInstall', label: 'התקנת מתג רשת (סוויץ׳)', icon: 'hub', category: 'cmNetwork', unit: 'piece' },
  { id: 'cmRouterSetup', label: 'התקנה והגדרת ראוטר', icon: 'router', category: 'cmNetwork', unit: 'piece' },
  { id: 'cmApInstall', label: 'התקנת נקודת גישה אלחוטית (Access Point)', icon: 'wifi', category: 'cmNetwork', unit: 'piece' },
  { id: 'cmMeshSetup', label: 'התקנת מערכת Mesh', icon: 'wifi-tethering', category: 'cmNetwork', unit: 'job' },
  { id: 'cmHomeNetwork', label: 'הגדרת רשת ביתית', icon: 'home', category: 'cmNetwork', unit: 'job' },
  { id: 'cmBusinessNetwork', label: 'הגדרת רשת עסקית (VLAN / רשת אורחים)', icon: 'business', category: 'cmNetwork', unit: 'job' },
  { id: 'cmWifiSurvey', label: 'סקר כיסוי WiFi', icon: 'search', category: 'cmNetwork', unit: 'job' },

  // מצלמות אבטחה
  { id: 'cmCamIndoor', label: 'מצלמה פנימית (כולל חיווט והתקנה)', icon: 'videocam', category: 'cmCctv', unit: 'piece' },
  { id: 'cmCamOutdoor', label: 'מצלמה חיצונית (כולל חיווט והתקנה)', icon: 'videocam', category: 'cmCctv', unit: 'piece' },
  { id: 'cmCamPtz', label: 'מצלמה ממונעת PTZ (כולל חיווט והתקנה)', icon: 'video-camera-front', category: 'cmCctv', unit: 'piece' },
  { id: 'cmNvr_4', family: 'cmNvr', familyLabel: 'מערכת הקלטה NVR (כולל הגדרות)', size: '4', sizeUnit: ' ערוצים', label: 'מערכת הקלטה NVR 4 ערוצים', icon: 'storage', category: 'cmCctv', unit: 'piece' },
  { id: 'cmNvr_8', family: 'cmNvr', familyLabel: 'מערכת הקלטה NVR (כולל הגדרות)', size: '8', sizeUnit: ' ערוצים', label: 'מערכת הקלטה NVR 8 ערוצים', icon: 'storage', category: 'cmCctv', unit: 'piece' },
  { id: 'cmNvr_16', family: 'cmNvr', familyLabel: 'מערכת הקלטה NVR (כולל הגדרות)', size: '16', sizeUnit: ' ערוצים', label: 'מערכת הקלטה NVR 16 ערוצים', icon: 'storage', category: 'cmCctv', unit: 'piece' },
  { id: 'cmNvr_32', family: 'cmNvr', familyLabel: 'מערכת הקלטה NVR (כולל הגדרות)', size: '32', sizeUnit: ' ערוצים', label: 'מערכת הקלטה NVR 32 ערוצים', icon: 'storage', category: 'cmCctv', unit: 'piece' },
  { id: 'cmRemoteView', label: 'הגדרת צפייה מרחוק בנייד', icon: 'smartphone', category: 'cmCctv', unit: 'job' },
  { id: 'cmVideoDoorbell', label: 'פעמון וידאו חכם (כולל התקנה)', icon: 'doorbell', category: 'cmCctv', unit: 'piece' },
  { id: 'cmCamRelocate', label: 'העתקה / כיוון מצלמה קיימת', icon: 'open-with', category: 'cmCctv', unit: 'piece' },

  // אזעקה
  { id: 'cmAlarmPanel', label: 'רכזת אזעקה + לוח מקשים (כולל תכנות)', icon: 'dialpad', category: 'cmAlarm', unit: 'piece' },
  { id: 'cmMotionDetector', label: 'גלאי נפח (תנועה)', icon: 'sensors', category: 'cmAlarm', unit: 'piece' },
  { id: 'cmDoorMagnet', label: 'מגנט לדלת / חלון', icon: 'sensor-door', category: 'cmAlarm', unit: 'piece' },
  { id: 'cmSirenIndoor', label: 'צופר פנימי', icon: 'volume-up', category: 'cmAlarm', unit: 'piece' },
  { id: 'cmSirenOutdoor', label: 'צופר חיצוני עם נצנץ', icon: 'campaign', category: 'cmAlarm', unit: 'piece' },
  { id: 'cmPanicButton', label: 'לחצן מצוקה', icon: 'emergency-share', category: 'cmAlarm', unit: 'piece' },
  { id: 'cmSmokeDetector', label: 'גלאי עשן מחובר לרכזת', icon: 'sensors', category: 'cmAlarm', unit: 'piece' },
  { id: 'cmAlarmMonitoring', label: 'חיבור למוקד + אפליקציה', icon: 'support-agent', category: 'cmAlarm', unit: 'job' },

  // אינטרקום ובקרת כניסה
  { id: 'cmVideoIntercom', label: 'אינטרקום וידאו (פנל כניסה + מסך)', icon: 'doorbell', category: 'cmIntercom', unit: 'piece' },
  { id: 'cmIntercomScreen', label: 'מסך אינטרקום נוסף', icon: 'tablet', category: 'cmIntercom', unit: 'piece' },
  { id: 'cmAudioIntercom', label: 'אינטרקום שמע', icon: 'phone', category: 'cmIntercom', unit: 'piece' },
  { id: 'cmKeypad', label: 'קודן / קורא תגים', icon: 'pin', category: 'cmIntercom', unit: 'piece' },
  { id: 'cmMagLock', label: 'מנעול אלקטרומגנטי', icon: 'lock', category: 'cmIntercom', unit: 'piece' },
  { id: 'cmElectricStrike', label: 'נעילה חשמלית (סטרייק)', icon: 'lock-open', category: 'cmIntercom', unit: 'piece' },
  { id: 'cmExitButton', label: 'לחצן יציאה', icon: 'logout', category: 'cmIntercom', unit: 'piece' },
  { id: 'cmGateConnect', label: 'חיבור אינטרקום לשער / חניה', icon: 'garage', category: 'cmIntercom', unit: 'job' },

  // שמע ומולטימדיה
  { id: 'cmSpeakerPoint', label: 'נקודת רמקול', icon: 'speaker', category: 'cmAv', unit: 'point' },
  { id: 'cmCeilingSpeaker', label: 'התקנת רמקול תקרה', icon: 'speaker', category: 'cmAv', unit: 'piece' },
  { id: 'cmTvWallMount', label: 'התקנת טלוויזיה על הקיר', icon: 'tv', category: 'cmAv', unit: 'piece' },
  { id: 'cmTvCableConceal', label: 'הסתרת כבלים לטלוויזיה', icon: 'visibility-off', category: 'cmAv', unit: 'piece' },
  { id: 'cmSoundbar', label: 'התקנת מקרן קול (סאונדבר)', icon: 'speaker', category: 'cmAv', unit: 'piece' },
  { id: 'cmProjector', label: 'התקנת מקרן + מסך', icon: 'videocam', category: 'cmAv', unit: 'piece' },
  { id: 'cmHomeTheater', label: 'התקנת מערכת קולנוע ביתי', icon: 'theaters', category: 'cmAv', unit: 'job' },

  // שירות ותחזוקה
  { id: 'cmServiceCall', label: 'קריאת שירות', icon: 'support-agent', category: 'cmService', unit: 'job' },
  { id: 'cmWorkHour', label: 'שעת עבודה', icon: 'schedule', category: 'cmService', unit: 'hour' },
  { id: 'cmFaultFinding', label: 'איתור ותיקון תקלה', icon: 'search', category: 'cmService', unit: 'job' },
  { id: 'cmJackReplace', label: 'החלפת שקע / מחבר', icon: 'settings-input-component', category: 'cmService', unit: 'piece' },
  { id: 'cmRemoteSupport', label: 'תמיכה מרחוק', icon: 'computer', category: 'cmService', unit: 'job' },

  // 📦 כבלים
  { id: 'cmMatCat6', label: 'כבל רשת CAT6', icon: 'settings-ethernet', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatCat6a', label: 'כבל רשת CAT6A', icon: 'settings-ethernet', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatCoax', label: 'כבל קואקס RG6', icon: 'settings-input-antenna', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatFiber', label: 'סיב אופטי', icon: 'linear-scale', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatAlarmCable_4', family: 'cmMatAlarmCable', familyLabel: 'כבל אזעקה', size: '4', sizeUnit: ' גידים', label: 'כבל אזעקה 4 גידים', icon: 'cable', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatAlarmCable_6', family: 'cmMatAlarmCable', familyLabel: 'כבל אזעקה', size: '6', sizeUnit: ' גידים', label: 'כבל אזעקה 6 גידים', icon: 'cable', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatAlarmCable_8', family: 'cmMatAlarmCable', familyLabel: 'כבל אזעקה', size: '8', sizeUnit: ' גידים', label: 'כבל אזעקה 8 גידים', icon: 'cable', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatSpeakerCable', label: 'כבל רמקולים', icon: 'cable', category: 'cmMatCables', unit: 'meter' },
  { id: 'cmMatHdmi_2', family: 'cmMatHdmi', familyLabel: 'כבל HDMI', size: '2', sizeUnit: ' מ׳', label: 'כבל HDMI 2 מ׳', icon: 'settings-input-hdmi', category: 'cmMatCables', unit: 'piece' },
  { id: 'cmMatHdmi_5', family: 'cmMatHdmi', familyLabel: 'כבל HDMI', size: '5', sizeUnit: ' מ׳', label: 'כבל HDMI 5 מ׳', icon: 'settings-input-hdmi', category: 'cmMatCables', unit: 'piece' },
  { id: 'cmMatHdmi_10', family: 'cmMatHdmi', familyLabel: 'כבל HDMI', size: '10', sizeUnit: ' מ׳', label: 'כבל HDMI 10 מ׳', icon: 'settings-input-hdmi', category: 'cmMatCables', unit: 'piece' },

  // 📦 אביזרים וחיבורים
  { id: 'cmMatKeystone', label: 'שקע רשת (קיסטון) CAT6', icon: 'settings-input-component', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatRj45', label: 'מחברי RJ45 (חבילה)', icon: 'extension', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPatchCord_05', family: 'cmMatPatchCord', familyLabel: 'מגשר רשת (פאץ׳ קורד)', size: '0.5', sizeUnit: ' מ׳', label: 'מגשר רשת 0.5 מ׳', icon: 'cable', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPatchCord_1', family: 'cmMatPatchCord', familyLabel: 'מגשר רשת (פאץ׳ קורד)', size: '1', sizeUnit: ' מ׳', label: 'מגשר רשת 1 מ׳', icon: 'cable', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPatchCord_2', family: 'cmMatPatchCord', familyLabel: 'מגשר רשת (פאץ׳ קורד)', size: '2', sizeUnit: ' מ׳', label: 'מגשר רשת 2 מ׳', icon: 'cable', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPatchCord_3', family: 'cmMatPatchCord', familyLabel: 'מגשר רשת (פאץ׳ קורד)', size: '3', sizeUnit: ' מ׳', label: 'מגשר רשת 3 מ׳', icon: 'cable', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPatchPanel_12', family: 'cmMatPatchPanel', familyLabel: 'פאנל ניתוב', size: '12', sizeUnit: ' פורטים', label: 'פאנל ניתוב 12 פורטים', icon: 'view-module', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPatchPanel_24', family: 'cmMatPatchPanel', familyLabel: 'פאנל ניתוב', size: '24', sizeUnit: ' פורטים', label: 'פאנל ניתוב 24 פורטים', icon: 'view-module', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPatchPanel_48', family: 'cmMatPatchPanel', familyLabel: 'פאנל ניתוב', size: '48', sizeUnit: ' פורטים', label: 'פאנל ניתוב 48 פורטים', icon: 'view-module', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatDuct_16', family: 'cmMatDuct', familyLabel: 'תעלה חיצונית', size: '16', sizeUnit: ' מ״מ', label: 'תעלה חיצונית 16 מ״מ', icon: 'linear-scale', category: 'cmMatParts', unit: 'meter' },
  { id: 'cmMatDuct_25', family: 'cmMatDuct', familyLabel: 'תעלה חיצונית', size: '25', sizeUnit: ' מ״מ', label: 'תעלה חיצונית 25 מ״מ', icon: 'linear-scale', category: 'cmMatParts', unit: 'meter' },
  { id: 'cmMatDuct_40', family: 'cmMatDuct', familyLabel: 'תעלה חיצונית', size: '40', sizeUnit: ' מ״מ', label: 'תעלה חיצונית 40 מ״מ', icon: 'linear-scale', category: 'cmMatParts', unit: 'meter' },
  { id: 'cmMatCamBox', label: 'קופסת חיבורים למצלמה', icon: 'crop-square', category: 'cmMatParts', unit: 'piece' },
  { id: 'cmMatPsu12v', label: 'ספק כוח 12V', icon: 'power', category: 'cmMatParts', unit: 'piece' },

  // 📦 ציוד להזמנה
  { id: 'cmMatCamIndoor', label: 'מצלמת IP פנימית', icon: 'videocam', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatCamOutdoor', label: 'מצלמת IP חיצונית', icon: 'videocam', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatNvr_4', family: 'cmMatNvr', familyLabel: 'מקליט NVR', size: '4', sizeUnit: ' ערוצים', label: 'מקליט NVR 4 ערוצים', icon: 'storage', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatNvr_8', family: 'cmMatNvr', familyLabel: 'מקליט NVR', size: '8', sizeUnit: ' ערוצים', label: 'מקליט NVR 8 ערוצים', icon: 'storage', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatNvr_16', family: 'cmMatNvr', familyLabel: 'מקליט NVR', size: '16', sizeUnit: ' ערוצים', label: 'מקליט NVR 16 ערוצים', icon: 'storage', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatHdd_1', family: 'cmMatHdd', familyLabel: 'דיסק קשיח למקליט', size: '1', sizeUnit: 'TB', label: 'דיסק קשיח 1TB', icon: 'storage', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatHdd_2', family: 'cmMatHdd', familyLabel: 'דיסק קשיח למקליט', size: '2', sizeUnit: 'TB', label: 'דיסק קשיח 2TB', icon: 'storage', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatHdd_4', family: 'cmMatHdd', familyLabel: 'דיסק קשיח למקליט', size: '4', sizeUnit: 'TB', label: 'דיסק קשיח 4TB', icon: 'storage', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatSwitch_8', family: 'cmMatSwitch', familyLabel: 'מתג רשת', size: '8', sizeUnit: ' פורטים', label: 'מתג רשת 8 פורטים', icon: 'hub', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatSwitch_16', family: 'cmMatSwitch', familyLabel: 'מתג רשת', size: '16', sizeUnit: ' פורטים', label: 'מתג רשת 16 פורטים', icon: 'hub', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatSwitch_24', family: 'cmMatSwitch', familyLabel: 'מתג רשת', size: '24', sizeUnit: ' פורטים', label: 'מתג רשת 24 פורטים', icon: 'hub', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatPoeSwitch_4', family: 'cmMatPoeSwitch', familyLabel: 'מתג PoE', size: '4', sizeUnit: ' פורטים', label: 'מתג PoE 4 פורטים', icon: 'hub', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatPoeSwitch_8', family: 'cmMatPoeSwitch', familyLabel: 'מתג PoE', size: '8', sizeUnit: ' פורטים', label: 'מתג PoE 8 פורטים', icon: 'hub', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatPoeSwitch_16', family: 'cmMatPoeSwitch', familyLabel: 'מתג PoE', size: '16', sizeUnit: ' פורטים', label: 'מתג PoE 16 פורטים', icon: 'hub', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatAp', label: 'נקודת גישה (Access Point)', icon: 'wifi', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatRack_6', family: 'cmMatRack', familyLabel: 'ארון תקשורת', size: '6U', sizeUnit: '', label: 'ארון תקשורת 6U', icon: 'dns', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatRack_9', family: 'cmMatRack', familyLabel: 'ארון תקשורת', size: '9U', sizeUnit: '', label: 'ארון תקשורת 9U', icon: 'dns', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatRack_12', family: 'cmMatRack', familyLabel: 'ארון תקשורת', size: '12U', sizeUnit: '', label: 'ארון תקשורת 12U', icon: 'dns', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatUps', label: 'אל-פסק (UPS)', icon: 'battery-charging-full', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatDetector', label: 'גלאי נפח', icon: 'sensors', category: 'cmMatEquipment', unit: 'piece' },
  { id: 'cmMatMagnet', label: 'מגנט לדלת / חלון', icon: 'sensor-door', category: 'cmMatEquipment', unit: 'piece' },
];

export const FAMILIES = [
  'outlet3Phase',
  'acPoint',
  'officeFloorBox',
  'conduitMarichef',
  'conduitShirshuri',
  'conduitCobra',
  'conduitPG',
  'cableTray',
  'panel1ph',
  'panel3ph',
  'mcb1ph',
  'mcb3ph',
  'rcbo',
  'contactor',
  'concreteBox',
  'gypsumBox',
  'frame',
  'adapterConcrete',
  'adapterGypsum',
];

// Legacy alias retained for backward compatibility
export const CONDUIT_FAMILIES = ['conduitMarichef', 'conduitShirshuri', 'conduitCobra', 'conduitPG'];

export function itemsByCategory(categoryId) {
  return CATALOG.filter((i) => i.category === categoryId);
}

export function itemsByFamily(familyId) {
  return CATALOG.filter((i) => i.family === familyId);
}

export function findItem(itemId) {
  return CATALOG.find((i) => i.id === itemId);
}

// חומר = פריט שהולך לרשימת הספק ולא מופיע בהצעת המחיר ללקוח.
// הגדרה ברמת פריט (isMaterial) גוברת על ההגדרה של הקטגוריה.
export function isMaterialItem(item) {
  if (!item) return false;
  if (typeof item.isMaterial === 'boolean') return item.isMaterial;
  const cat = CATEGORIES.find((c) => c.id === item.category);
  return !!cat?.isMaterial;
}

// פריטים שמתומחרים בהצעה ללקוח (לא מוסתרים ולא חומר)
export function pricedItemsByCategory(categoryId, professionId) {
  return CATALOG.filter((i) => i.category === categoryId && !i.hidden && !isMaterialItem(i)
    && itemBelongsToProfession(i, professionId));
}

export function categoriesForProfession(professionId) {
  if (!professionId) return CATEGORIES;
  return CATEGORIES.filter((c) => !c.professions || c.professions.includes(professionId));
}

export function itemBelongsToProfession(item, professionId) {
  if (!professionId || !item) return true;
  // הגדרה ברמת פריט (למשל פריט חשמלאי בקטגוריה משותפת) גוברת על הקטגוריה
  if (item.professions) return item.professions.includes(professionId);
  const cat = CATEGORIES.find((c) => c.id === item.category);
  if (!cat || !cat.professions) return true;
  return cat.professions.includes(professionId);
}

export const VAT_RATE = 0.18;
