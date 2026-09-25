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
  { id: 'boxes', label: 'קופסאות', icon: 'inventory-2', professions: ['electrician'] },
  { id: 'frames', label: 'מסגרות', icon: 'crop-free', professions: ['electrician'] },

  // ============ אינסטלטור ============
  { id: 'plumbingPipes', label: 'צנרת מים וחיבורים', icon: 'plumbing', professions: ['plumber'], isMaterial: true },
  { id: 'plumbingFaucets', label: 'ברזים ושסתומים', icon: 'water-drop', professions: ['plumber'] },
  { id: 'plumbingDrains', label: 'ניקוז וביוב', icon: 'waves', professions: ['plumber'] },
  { id: 'plumbingBath', label: 'אמבטיה ושירותים', icon: 'bathtub', professions: ['plumber'] },
  { id: 'plumbingWater', label: 'חימום מים', icon: 'hot-tub', professions: ['plumber'] },
  { id: 'plumbingTreatment', label: 'טיהור ולחץ מים', icon: 'opacity', professions: ['plumber'] },
  { id: 'plumbingFloor', label: 'חימום תת-רצפתי', icon: 'thermostat', professions: ['plumber'] },
  { id: 'plumbingGas', label: 'גז', icon: 'local-fire-department', professions: ['plumber'] },

  // ============ איש תקשורת ============
  { id: 'commsCabling', label: 'כבילה', icon: 'cable', professions: ['comms'], isMaterial: true },
  { id: 'commsJacks', label: 'שקעים ופאנלים', icon: 'settings-ethernet', professions: ['comms'] },
  { id: 'commsActive', label: 'ציוד רשת', icon: 'router', professions: ['comms'] },
  { id: 'commsMultimedia', label: 'מולטימדיה ושמע', icon: 'speaker', professions: ['comms'] },
  { id: 'commsCabinets', label: 'ארונות תקשורת', icon: 'dns', professions: ['comms'] },
  { id: 'commsCctv', label: 'מצלמות אבטחה', icon: 'videocam', professions: ['comms'] },
  { id: 'commsAlarm', label: 'אזעקה וגילוי אש', icon: 'notifications-active', professions: ['comms'] },
  { id: 'commsAccess', label: 'בקרת כניסה', icon: 'lock', professions: ['comms'] },

  // ============ שיפוצניק ============
  { id: 'paintPrimers', label: 'צבע ופרימרים', icon: 'format-paint', professions: ['contractor'] },
  { id: 'gypsumWalls', label: 'גבס וקירות', icon: 'view-day', professions: ['contractor'] },
  { id: 'flooringTiles', label: 'ריצוף וקרמיקה', icon: 'grid-on', professions: ['contractor'] },
  { id: 'buildMaterials', label: 'חומרי בניין', icon: 'inventory', professions: ['contractor'], isMaterial: true },
  { id: 'buildOpenings', label: 'חלונות ודלתות', icon: 'door-front', professions: ['contractor'] },
  { id: 'buildInsulation', label: 'בידוד', icon: 'blur-on', professions: ['contractor'] },
  { id: 'toolConsumables', label: 'חומרים מתכלים', icon: 'handyman', professions: ['contractor'], isMaterial: true },
  { id: 'safetyGear', label: 'ציוד בטיחות אישי', icon: 'health-and-safety', professions: ['contractor'], isMaterial: true },

  // ============ משותף לכל המקצועות ============
  { id: 'misc', label: 'אביזרים נוספים', icon: 'category', professions: ['electrician', 'plumber', 'comms', 'contractor'] },
];

export const CATALOG = [
  // ============ תאורה ============
  { id: 'lightPoint', label: 'נקודת מאור', icon: 'lightbulb', category: 'lighting', unit: 'point' },
  { id: 'recessedSpot', label: 'ספוט שקוע', icon: 'highlight', category: 'lighting', unit: 'piece' },
  { id: 'wallLamp', label: 'נקודת מנורת קיר', icon: 'wb-iridescent', category: 'lighting', unit: 'point' },
  { id: 'gardenLight', label: 'גוף תאורת גינה', icon: 'park', category: 'lighting', unit: 'piece' },
  { id: 'emergencyLight', label: 'תאורת חירום', icon: 'emergency', category: 'lighting', unit: 'piece' },

  // ============ שקעים ============
  { id: 'outlet16Single', label: 'שקע כח יחיד', icon: 'power', category: 'outlets', unit: 'piece' },
  { id: 'outlet16Double', label: 'שקע כח כפול', icon: 'power', category: 'outlets', unit: 'piece' },
  { id: 'outlet16Triple', label: 'שלישיית שקעים', icon: 'power', category: 'outlets', unit: 'piece' },
  { id: 'outletUsb', label: 'שקע USB', icon: 'usb', category: 'outlets', unit: 'piece' },
  { id: 'outletWaterproof', label: 'שקע מוגן מים', icon: 'opacity', category: 'outlets', unit: 'piece' },
  { id: 'outlet3Phase', label: 'שקע תלת פאזי', icon: 'electrical-services', category: 'outlets', unit: 'piece' },
  { id: 'outletFloor', label: 'שקע רצפה', icon: 'south', category: 'outlets', unit: 'piece' },
  { id: 'outletWithSwitch', label: 'שקע עם מפסק', icon: 'toggle-on', category: 'outlets', unit: 'piece' },
  { id: 'outletPhone', label: 'שקע טלפון', icon: 'phone', category: 'outlets', unit: 'piece' },
  { id: 'outletPower', label: 'נקודת שקע רגיל', icon: 'electrical-services', category: 'outlets', unit: 'piece' },
  { id: 'ventPoint', label: 'נקודת וונטה', icon: 'air', category: 'outlets', unit: 'point' },

  // ============ מפסקים ============
  { id: 'switchSingle', label: 'מפסק יחיד', icon: 'toggle-off', category: 'switches', unit: 'piece' },
  { id: 'switchDouble', label: 'מפסק כפול', icon: 'toggle-on', category: 'switches', unit: 'piece' },
  { id: 'switchCrossover', label: 'מפסק חילופים', icon: 'compare-arrows', category: 'switches', unit: 'piece' },
  { id: 'switchDimmer', label: 'מפסק דימר', icon: 'tune', category: 'switches', unit: 'piece' },
  { id: 'switchSmart', label: 'מפסק חכם', icon: 'smartphone', category: 'switches', unit: 'piece' },
  { id: 'switchTimer', label: 'מפסק טיימר', icon: 'timer', category: 'switches', unit: 'piece' },

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
  { id: 'cableTelephone', label: 'כבל טלפון', icon: 'cable', category: 'cables', unit: 'meter' },

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

  // ============ לוחות חשמל ============

  // לוח חד-פאזי (משפחה)
  { id: 'panel1ph_4', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '4', label: 'לוח חד-פאזי 4 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece' },
  { id: 'panel1ph_6', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '6', label: 'לוח חד-פאזי 6 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece' },
  { id: 'panel1ph_8', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '8', label: 'לוח חד-פאזי 8 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece' },
  { id: 'panel1ph_12', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '12', label: 'לוח חד-פאזי 12 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece' },
  { id: 'panel1ph_24', family: 'panel1ph', familyLabel: 'לוח חד-פאזי', size: '24', label: 'לוח חד-פאזי 24 מודולים', icon: 'dashboard', category: 'panels', unit: 'piece' },

  // לוח תלת-פאזי (משפחה)
  { id: 'panel3ph_12', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '12', label: 'לוח תלת-פאזי 12 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },
  { id: 'panel3ph_24', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '24', label: 'לוח תלת-פאזי 24 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },
  { id: 'panel3ph_36', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '36', label: 'לוח תלת-פאזי 36 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },
  { id: 'panel3ph_48', family: 'panel3ph', familyLabel: 'לוח תלת-פאזי', size: '48', label: 'לוח תלת-פאזי 48 מודולים', icon: 'view-module', category: 'panels', unit: 'piece' },

  // לוחות אחרים
  { id: 'panelOutdoor', label: 'לוח חיצוני IP65', icon: 'shield', category: 'panels', unit: 'piece' },
  { id: 'panelRail', label: 'פס DIN למודולים', icon: 'view-stream', category: 'panels', unit: 'piece' },

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
  { id: 'rcbo_16', family: 'rcbo', familyLabel: 'מפסק פחת משולב (RCBO)', size: '16A', label: 'מפסק פחת משולב 16A', icon: 'security', category: 'safety', unit: 'piece' },
  { id: 'rcbo_25', family: 'rcbo', familyLabel: 'מפסק פחת משולב (RCBO)', size: '25A', label: 'מפסק פחת משולב 25A', icon: 'security', category: 'safety', unit: 'piece' },
  { id: 'rcbo_32', family: 'rcbo', familyLabel: 'מפסק פחת משולב (RCBO)', size: '32A', label: 'מפסק פחת משולב 32A', icon: 'security', category: 'safety', unit: 'piece' },
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
  { id: 'photocell', label: 'פוטוצל (חיישן יום-לילה)', icon: 'wb-twilight', category: 'control', unit: 'piece' },
  { id: 'timeSwitch', label: 'טיימר תאורה', icon: 'timer', category: 'control', unit: 'piece' },
  { id: 'sabbathTimer', label: 'שעון שבת', icon: 'schedule', category: 'control', unit: 'piece' },
  { id: 'surgeProtector', label: 'הגנת ברק (SPD)', icon: 'bolt', category: 'safety', unit: 'piece' },

  // ============ תקשורת ============
  { id: 'dataPoint', label: 'נקודת רשת CAT6', icon: 'router', category: 'comms', unit: 'point' },
  { id: 'dataPointCat7', label: 'נקודת רשת CAT7', icon: 'router', category: 'comms', unit: 'point' },
  { id: 'tvPoint', label: 'נקודת טלוויזיה', icon: 'tv', category: 'comms', unit: 'point' },
  { id: 'intercomPoint', label: 'נקודת אינטרקום', icon: 'phone', category: 'comms', unit: 'point' },
  { id: 'speakerPoint', label: 'נקודת רמקול', icon: 'speaker', category: 'comms', unit: 'point' },
  { id: 'cameraPoint', label: 'נקודת מצלמה (CCTV)', icon: 'videocam', category: 'comms', unit: 'point' },
  { id: 'doorbellPoint', label: 'נקודת פעמון/אינטרקום', icon: 'doorbell', category: 'comms', unit: 'point' },
  { id: 'cableCat6', label: 'כבל רשת CAT6', icon: 'settings-ethernet', category: 'comms', unit: 'meter' },
  { id: 'cableCat7', label: 'כבל רשת CAT7', icon: 'settings-ethernet', category: 'comms', unit: 'meter' },
  { id: 'cableCoax', label: 'כבל קואקסיאלי', icon: 'settings-input-antenna', category: 'comms', unit: 'meter' },
  { id: 'cableHdmi', label: 'כבל HDMI', icon: 'settings-input-hdmi', category: 'comms', unit: 'meter' },

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
  { id: 'officeFloorBox', label: 'קופסת אופיס', icon: 'view-quilt', category: 'boxes', unit: 'piece' },

  // ============ אביזרים נוספים (חשמלאי) ============
  { id: 'electricalTape', label: 'בידוד (סלוטייפ חשמלאי)', icon: 'colorize', category: 'misc', unit: 'piece' },
  { id: 'cableTie', label: 'אזיקון/חבק (חבילה)', icon: 'link', category: 'misc', unit: 'piece' },
  { id: 'smokeDetector', label: 'גלאי עשן', icon: 'sensors', category: 'misc', unit: 'piece' },

  // ============ חשמלאי — בית חכם וטכנולוגיה (חדש) ============
  { id: 'smartSwitchShelly', label: 'מודול חכם Shelly 1', icon: 'smart-toy', category: 'smartHome', unit: 'piece' },
  { id: 'smartSwitchShelly2', label: 'מודול חכם Shelly 2.5 (תריס)', icon: 'smart-toy', category: 'smartHome', unit: 'piece' },
  { id: 'smartSocketSonoff', label: 'שקע חכם Sonoff', icon: 'smart-toy', category: 'smartHome', unit: 'piece' },
  { id: 'smartLockYale', label: 'מנעול חכם דלת', icon: 'lock', category: 'smartHome', unit: 'piece' },
  { id: 'evCharger7kw', label: 'עמדת טעינה לרכב חשמלי 7kW', icon: 'ev-station', category: 'energy', unit: 'piece' },
  { id: 'evCharger22kw', label: 'עמדת טעינה לרכב חשמלי 22kW', icon: 'ev-station', category: 'energy', unit: 'piece' },
  { id: 'acPoint', label: 'פקט למזגן', icon: 'ac-unit', category: 'outlets', unit: 'point' },
  { id: 'solarInverter5kw', label: 'אינוורטר סולארי 5kW', icon: 'solar-power', category: 'energy', unit: 'piece' },
  { id: 'solarPanel400w', label: 'פאנל סולארי 400W', icon: 'solar-power', category: 'energy', unit: 'piece' },
  { id: 'floorHeatingPad', label: 'יריעת חימום רצפה חשמלית', icon: 'thermostat', category: 'energy', unit: 'meter' },
  { id: 'floorHeatingThermo', label: 'תרמוסטט חימום רצפה', icon: 'thermostat', category: 'energy', unit: 'piece' },

  // ============================================================
  // ============ אינסטלטור — תוספות (חדש) ============
  { id: 'gasPipeCopper15', label: 'צינור גז נחושת 15 מ"מ', icon: 'local-fire-department', category: 'plumbingGas', unit: 'meter' },
  { id: 'gasValve', label: 'ברז גז כדורי', icon: 'local-fire-department', category: 'plumbingGas', unit: 'piece' },
  { id: 'gasRegulator', label: 'וסת גז ביתי', icon: 'compress', category: 'plumbingGas', unit: 'piece' },
  { id: 'waterFilter', label: 'מסנן מים תחת הכיור', icon: 'opacity', category: 'plumbingTreatment', unit: 'piece' },
  { id: 'waterPurifier', label: 'מערכת טיהור מים (RO)', icon: 'opacity', category: 'plumbingTreatment', unit: 'piece' },
  { id: 'boosterPump', label: 'משאבת בוסטר (הגברת לחץ)', icon: 'electric-meter', category: 'plumbingTreatment', unit: 'piece' },
  { id: 'circulationPump', label: 'משאבת חזרה (מים חמים)', icon: 'autorenew', category: 'plumbingTreatment', unit: 'piece' },
  { id: 'thermalMixer', label: 'מערבל תרמוסטטי', icon: 'merge-type', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'underFloorHeatingPex', label: 'צנרת חימום תת-רצפתי PEX', icon: 'thermostat', category: 'plumbingFloor', unit: 'meter' },
  { id: 'bidet', label: 'בידה / מוסך לאסלה', icon: 'shower', category: 'plumbingBath', unit: 'piece' },
  { id: 'cornerToilet', label: 'אסלת פינה', icon: 'wc', category: 'plumbingBath', unit: 'piece' },
  { id: 'kitchenSinkDouble', label: 'כיור מטבח כפול', icon: 'kitchen', category: 'plumbingBath', unit: 'piece' },

  // ============================================================
  // ============ תקשורת — תוספות (חדש) ============
  { id: 'meshWifiSet', label: 'סט Mesh WiFi (3 יחידות)', icon: 'wifi-tethering', category: 'commsActive', unit: 'piece' },
  { id: 'smartDoorbell', label: 'פעמון חכם עם מצלמה', icon: 'doorbell', category: 'commsCctv', unit: 'piece' },
  { id: 'cellularBooster', label: 'מגבר אות סלולרי', icon: 'cell-tower', category: 'commsActive', unit: 'piece' },
  { id: 'cableTester', label: 'בודק כבלי רשת', icon: 'cable', category: 'commsCabling', unit: 'piece' },
  { id: 'tvBracket', label: 'זרוע מתכוונת לטלוויזיה', icon: 'tv', category: 'commsMultimedia', unit: 'piece' },
  { id: 'multiRoomSpeaker', label: 'רמקול תקרה Multi-Room', icon: 'speaker', category: 'commsMultimedia', unit: 'piece' },
  { id: 'soundBar', label: 'סאונדבר לטלוויזיה', icon: 'speaker', category: 'commsMultimedia', unit: 'piece' },
  { id: 'panicButton', label: 'לחצן מצוקה אלחוטי', icon: 'emergency-share', category: 'commsAlarm', unit: 'piece' },
  { id: 'cctvDvr8', label: 'DVR אנלוגי 8 ערוצים', icon: 'storage', category: 'commsCctv', unit: 'piece' },
  { id: 'opticalSplitter', label: 'מפצל סיב אופטי', icon: 'call-split', category: 'commsCabling', unit: 'piece' },

  // ============================================================
  // ============ שיפוצניק — תוספות (חדש) ============
  { id: 'insulationStyrofoam', label: 'בידוד קלקר 5 ס"מ', icon: 'view-day', category: 'buildInsulation', unit: 'meter' },
  { id: 'insulationGlassWool', label: 'בידוד צמר זכוכית', icon: 'blur-on', category: 'buildInsulation', unit: 'meter' },
  { id: 'insulationPolyurethane', label: 'בידוד פוליאוריטן (התזה)', icon: 'cloud', category: 'buildInsulation', unit: 'meter' },
  { id: 'windowAluminum', label: 'חלון אלומיניום (מ"ר)', icon: 'window', category: 'buildOpenings', unit: 'meter' },
  { id: 'doorInterior', label: 'דלת פנים', icon: 'door-front', category: 'buildOpenings', unit: 'piece' },
  { id: 'doorSecurity', label: 'דלת ביטחון', icon: 'door-front', category: 'buildOpenings', unit: 'piece' },
  { id: 'graniteCountertop', label: 'משטח גרניט (מ"ר)', icon: 'crop-landscape', category: 'flooringTiles', unit: 'meter' },
  { id: 'marbleSlab', label: 'משטח שיש (מ"ר)', icon: 'crop-landscape', category: 'flooringTiles', unit: 'meter' },
  { id: 'scaffoldingRental', label: 'השכרת פיגום (יום)', icon: 'construction', category: 'toolConsumables', unit: 'piece' },
  { id: 'rubbishContainer', label: 'מיכל פסולת (יום)', icon: 'delete', category: 'toolConsumables', unit: 'piece' },
  { id: 'siliconeKitchen', label: 'סיליקון מטבח/אמבטיה', icon: 'colorize', category: 'toolConsumables', unit: 'piece' },
  { id: 'puGlue', label: 'דבק פוליאוריטן', icon: 'colorize', category: 'toolConsumables', unit: 'piece' },

  // ============================================================
  // ============ אינסטלטור — צנרת מים ============
  { id: 'pipePex16', label: 'צינור PEX 16', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipePex20', label: 'צינור PEX 20', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipePex25', label: 'צינור PEX 25', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeCopper15', label: 'צינור נחושת 15 מ"מ', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeCopper22', label: 'צינור נחושת 22 מ"מ', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeHdpe32', label: 'צינור פוליאתילן 32', icon: 'waves', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeHdpe40', label: 'צינור פוליאתילן 40', icon: 'waves', category: 'plumbingPipes', unit: 'meter' },
  { id: 'flaxRope', label: 'חוטי פשתן (אטימה)', icon: 'colorize', category: 'plumbingPipes', unit: 'piece' },
  { id: 'pipeInsulation', label: 'בידוד צנרת (מטר)', icon: 'view-stream', category: 'plumbingPipes', unit: 'meter' },

  // ============ אינסטלטור — ברזים ============
  { id: 'faucetKitchen', label: 'ברז מטבח רגיל', icon: 'kitchen', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'faucetKitchenPull', label: 'ברז מטבח שלוף', icon: 'kitchen', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'faucetBathMixer', label: 'ברז אמבטיה מערבל', icon: 'bathtub', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'faucetBathRegular', label: 'ברז אמבטיה רגיל', icon: 'bathtub', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'faucetSink', label: 'ברז כיור אמבטיה', icon: 'water-drop', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'faucetGarden', label: 'ברז גן', icon: 'park', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'ballValveHalf', label: 'ברז כדורי 1/2"', icon: 'radio-button-checked', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'ballValveThreeQ', label: 'ברז כדורי 3/4"', icon: 'radio-button-checked', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'ballValveOne', label: 'ברז כדורי 1"', icon: 'radio-button-checked', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'flexHoseHalf', label: 'גמיש 1/2" (40 ס"מ)', icon: 'linear-scale', category: 'plumbingFaucets', unit: 'piece' },

  // ============ אינסטלטור — ניקוז וביוב ============
  { id: 'drainFloor', label: 'מחסום רצפה', icon: 'circle', category: 'plumbingDrains', unit: 'piece' },
  { id: 'drainSquareInox', label: 'מחסום ריבוע נירוסטה', icon: 'crop-square', category: 'plumbingDrains', unit: 'piece' },
  { id: 'sewerPipe50', label: 'צינור ביוב 50 מ"מ', icon: 'linear-scale', category: 'plumbingDrains', unit: 'meter' },
  { id: 'sewerPipe110', label: 'צינור ביוב 110 מ"מ', icon: 'linear-scale', category: 'plumbingDrains', unit: 'meter' },
  { id: 'sewerY110', label: 'מחבר Y 110', icon: 'call-split', category: 'plumbingDrains', unit: 'piece' },
  { id: 'sewerT110', label: 'מחבר T 110', icon: 'call-merge', category: 'plumbingDrains', unit: 'piece' },
  { id: 'sewerElbow110', label: 'זווית 110', icon: 'turn-right', category: 'plumbingDrains', unit: 'piece' },
  { id: 'checkValve', label: 'שסתום אל-חוזר', icon: 'sync-alt', category: 'plumbingDrains', unit: 'piece' },

  // ============ אינסטלטור — אמבטיה ושירותים ============
  { id: 'toiletMonoblock', label: 'אסלה מונובלוק', icon: 'wc', category: 'plumbingBath', unit: 'piece' },
  { id: 'toiletWallHung', label: 'אסלה תלויה', icon: 'wc', category: 'plumbingBath', unit: 'piece' },
  { id: 'cisternBuiltin', label: 'מיכל הדחה פנימי', icon: 'inventory-2', category: 'plumbingBath', unit: 'piece' },
  { id: 'washbasin', label: 'כיור אמבטיה', icon: 'water-drop', category: 'plumbingBath', unit: 'piece' },
  { id: 'bathtubAcrylic', label: 'אמבט אקרילי', icon: 'bathtub', category: 'plumbingBath', unit: 'piece' },
  { id: 'showerCabin', label: 'מקלחון', icon: 'shower', category: 'plumbingBath', unit: 'piece' },
  { id: 'showerHead', label: 'ראש מקלחת', icon: 'shower', category: 'plumbingBath', unit: 'piece' },
  { id: 'showerRail', label: 'מוט מקלחת + שלט', icon: 'linear-scale', category: 'plumbingBath', unit: 'piece' },
  { id: 'toiletPaperHolder', label: 'מתלה נייר טואלט', icon: 'bookmark-border', category: 'plumbingBath', unit: 'piece' },

  // ============ אינסטלטור — חימום מים ============
  { id: 'solarTank150', label: 'דוד שמש 150 ליטר', icon: 'wb-sunny', category: 'plumbingWater', unit: 'piece' },
  { id: 'solarTank200', label: 'דוד שמש 200 ליטר', icon: 'wb-sunny', category: 'plumbingWater', unit: 'piece' },
  { id: 'solarCollectors', label: 'קולטים סולאריים (זוג)', icon: 'solar-power', category: 'plumbingWater', unit: 'piece' },
  { id: 'electricBoiler50', label: 'דוד חשמלי 50 ליטר', icon: 'hot-tub', category: 'plumbingWater', unit: 'piece' },
  { id: 'electricBoiler80', label: 'דוד חשמלי 80 ליטר', icon: 'hot-tub', category: 'plumbingWater', unit: 'piece' },
  { id: 'electricBoiler150', label: 'דוד חשמלי 150 ליטר', icon: 'hot-tub', category: 'plumbingWater', unit: 'piece' },
  { id: 'heatingElement', label: 'גוף חימום לדוד', icon: 'flash-on', category: 'plumbingWater', unit: 'piece' },
  { id: 'boilerThermostat', label: 'תרמוסטט לדוד', icon: 'thermostat', category: 'plumbingWater', unit: 'piece' },
  { id: 'waterMeter', label: 'שעון מים', icon: 'speed', category: 'plumbingTreatment', unit: 'piece' },
  { id: 'pressureReducer', label: 'מפחית לחץ', icon: 'compress', category: 'plumbingTreatment', unit: 'piece' },

  // ============================================================
  // ============ איש תקשורת — כבילה ============
  { id: 'cableCat5e', label: 'כבל רשת CAT5e', icon: 'settings-ethernet', category: 'commsCabling', unit: 'meter' },
  { id: 'cableCat6Utp', label: 'כבל CAT6 UTP', icon: 'settings-ethernet', category: 'commsCabling', unit: 'meter' },
  { id: 'cableCat6aUtp', label: 'כבל CAT6a UTP', icon: 'settings-ethernet', category: 'commsCabling', unit: 'meter' },
  { id: 'cableCat6Stp', label: 'כבל CAT6 STP מסוכך', icon: 'settings-ethernet', category: 'commsCabling', unit: 'meter' },
  { id: 'fiberOm3', label: 'סיב אופטי OM3 (Multimode)', icon: 'linear-scale', category: 'commsCabling', unit: 'meter' },
  { id: 'fiberOs2', label: 'סיב אופטי OS2 (Singlemode)', icon: 'linear-scale', category: 'commsCabling', unit: 'meter' },
  { id: 'cableRg6', label: 'כבל RG6 קואקס', icon: 'settings-input-antenna', category: 'commsCabling', unit: 'meter' },
  { id: 'cableSpeaker', label: 'כבל רמקולים 2×1.5', icon: 'cable', category: 'commsCabling', unit: 'meter' },

  // ============ איש תקשורת — שקעים ופאנלים ============
  { id: 'jackCat6Single', label: 'שקע CAT6 RJ45 יחיד', icon: 'settings-input-component', category: 'commsJacks', unit: 'piece' },
  { id: 'jackCat6Double', label: 'שקע CAT6 RJ45 כפול', icon: 'settings-input-component', category: 'commsJacks', unit: 'piece' },
  { id: 'jackCat6aStp', label: 'שקע CAT6a STP מסוכך', icon: 'settings-input-component', category: 'commsJacks', unit: 'piece' },
  { id: 'keystoneCat6', label: 'קיסטון CAT6', icon: 'extension', category: 'commsJacks', unit: 'piece' },
  { id: 'patchPanel24', label: 'פאנל פאצ\' 24 פורט', icon: 'view-module', category: 'commsJacks', unit: 'piece' },
  { id: 'patchPanel48', label: 'פאנל פאצ\' 48 פורט', icon: 'view-module', category: 'commsJacks', unit: 'piece' },
  { id: 'wallPanel6', label: 'פאנל קיר 6 פורט', icon: 'view-quilt', category: 'commsJacks', unit: 'piece' },
  { id: 'patchCord1m', label: 'פאצ\' קורד CAT6 (1 מ׳)', icon: 'cable', category: 'commsJacks', unit: 'piece' },
  { id: 'patchCord2m', label: 'פאצ\' קורד CAT6 (2 מ׳)', icon: 'cable', category: 'commsJacks', unit: 'piece' },

  // ============ איש תקשורת — ציוד פעיל ============
  { id: 'switch8', label: 'מתג 8 פורט', icon: 'hub', category: 'commsActive', unit: 'piece' },
  { id: 'switch24Managed', label: 'מתג 24 פורט מנוהל', icon: 'hub', category: 'commsActive', unit: 'piece' },
  { id: 'switch48Poe', label: 'מתג 48 פורט PoE', icon: 'hub', category: 'commsActive', unit: 'piece' },
  { id: 'routerWifi', label: 'ראוטר WiFi 6', icon: 'router', category: 'commsActive', unit: 'piece' },
  { id: 'accessPointCeiling', label: 'Access Point תקרה', icon: 'wifi', category: 'commsActive', unit: 'piece' },
  { id: 'poeInjector', label: 'PoE Injector', icon: 'power', category: 'commsActive', unit: 'piece' },
  { id: 'mediaConverter', label: 'Media Converter (סיב)', icon: 'swap-horiz', category: 'commsActive', unit: 'piece' },
  { id: 'opticalSwitch', label: 'מתג אופטי 8 פורט', icon: 'hub', category: 'commsActive', unit: 'piece' },

  // ============ איש תקשורת — ארונות ============
  { id: 'rack6u', label: 'ארון תקשורת 6U', icon: 'dns', category: 'commsCabinets', unit: 'piece' },
  { id: 'rack12u', label: 'ארון תקשורת 12U', icon: 'dns', category: 'commsCabinets', unit: 'piece' },
  { id: 'rack24u', label: 'ארון תקשורת 24U', icon: 'dns', category: 'commsCabinets', unit: 'piece' },
  { id: 'rack42u', label: 'ארון תקשורת 42U', icon: 'dns', category: 'commsCabinets', unit: 'piece' },
  { id: 'rackFan', label: 'מאוורר לארון', icon: 'air', category: 'commsCabinets', unit: 'piece' },
  { id: 'rackShelf', label: 'שלף לארון 19"', icon: 'view-stream', category: 'commsCabinets', unit: 'piece' },
  { id: 'rackPdu', label: 'פס שקעים PDU 8', icon: 'power-input', category: 'commsCabinets', unit: 'piece' },

  // ============ איש תקשורת — מצלמות ואבטחה ============
  { id: 'ipCameraOutdoor', label: 'מצלמת IP חיצונית', icon: 'videocam', category: 'commsCctv', unit: 'piece' },
  { id: 'ipCameraIndoor', label: 'מצלמת IP פנימית', icon: 'videocam', category: 'commsCctv', unit: 'piece' },
  { id: 'ptzCamera', label: 'מצלמת PTZ', icon: 'video-camera-front', category: 'commsCctv', unit: 'piece' },
  { id: 'nvr8', label: 'NVR 8 ערוצים', icon: 'storage', category: 'commsCctv', unit: 'piece' },
  { id: 'nvr16', label: 'NVR 16 ערוצים', icon: 'storage', category: 'commsCctv', unit: 'piece' },
  { id: 'hdd2tb', label: 'דיסק קשיח 2TB (Surveillance)', icon: 'storage', category: 'commsCctv', unit: 'piece' },
  { id: 'intercomVideo', label: 'אינטרקום וידאו', icon: 'doorbell', category: 'commsCctv', unit: 'piece' },
  { id: 'intercomAudio', label: 'אינטרקום קולי', icon: 'phone', category: 'commsCctv', unit: 'piece' },
  { id: 'accessControlReader', label: 'קורא בקרת כניסה', icon: 'pin', category: 'commsAccess', unit: 'piece' },

  // ============================================================
  // ============ שיפוצניק — צבע ============
  { id: 'paintSuperKril', label: 'סופרקריל פנים (גלון)', icon: 'format-paint', category: 'paintPrimers', unit: 'piece' },
  { id: 'paintAcrylic', label: 'אקרילי פנים (גלון)', icon: 'format-paint', category: 'paintPrimers', unit: 'piece' },
  { id: 'paintExterior', label: 'צבע חוץ (גלון)', icon: 'format-paint', category: 'paintPrimers', unit: 'piece' },
  { id: 'primerUniversal', label: 'פרימר רב-תכליתי (גלון)', icon: 'opacity', category: 'paintPrimers', unit: 'piece' },
  { id: 'paintOil', label: 'צבע שמן (ליטר)', icon: 'format-paint', category: 'paintPrimers', unit: 'piece' },
  { id: 'lacquerWood', label: 'לכה לעץ (ליטר)', icon: 'brush', category: 'paintPrimers', unit: 'piece' },
  { id: 'epoxyKit', label: 'מערכת אפוקסי 2-קומפ', icon: 'science', category: 'paintPrimers', unit: 'piece' },
  { id: 'antiMold', label: 'צבע אנטי-עובש (גלון)', icon: 'shield', category: 'paintPrimers', unit: 'piece' },

  // ============ שיפוצניק — גבס וקירות ============
  { id: 'gypsumBoard125', label: 'לוח גבס 12.5 מ"מ', icon: 'view-day', category: 'gypsumWalls', unit: 'piece' },
  { id: 'gypsumBoardWaterproof', label: 'לוח גבס עמיד מים', icon: 'water-damage', category: 'gypsumWalls', unit: 'piece' },
  { id: 'gypsumBoardFire', label: 'לוח גבס חסין אש', icon: 'local-fire-department', category: 'gypsumWalls', unit: 'piece' },
  { id: 'profileUd27', label: 'פרופיל UD27 (3 מ׳)', icon: 'linear-scale', category: 'gypsumWalls', unit: 'piece' },
  { id: 'profileCd60', label: 'פרופיל CD60 (3 מ׳)', icon: 'linear-scale', category: 'gypsumWalls', unit: 'piece' },
  { id: 'gypsumScrews', label: 'ברגי גבס (קופסה)', icon: 'settings', category: 'gypsumWalls', unit: 'piece' },
  { id: 'spackleFill', label: 'שפכטל מילוי (5 ק"ג)', icon: 'inventory-2', category: 'gypsumWalls', unit: 'piece' },
  { id: 'spackleFinish', label: 'שפכטל גמר (5 ק"ג)', icon: 'inventory-2', category: 'gypsumWalls', unit: 'piece' },
  { id: 'jointTape', label: 'רשת זכוכית (90 מ׳)', icon: 'view-stream', category: 'gypsumWalls', unit: 'piece' },
  { id: 'cornerBead', label: 'פינת מתכת לגבס', icon: 'square-foot', category: 'gypsumWalls', unit: 'piece' },

  // ============ שיפוצניק — ריצוף וקרמיקה ============
  { id: 'tileCer6060', label: 'אריח קרמיקה 60×60', icon: 'grid-on', category: 'flooringTiles', unit: 'meter' },
  { id: 'tileCer3030', label: 'אריח קרמיקה 30×30', icon: 'grid-on', category: 'flooringTiles', unit: 'meter' },
  { id: 'tilePorcelain8080', label: 'גרניט פורצלן 80×80', icon: 'grid-on', category: 'flooringTiles', unit: 'meter' },
  { id: 'tilePorcelain6060', label: 'גרניט פורצלן 60×60', icon: 'grid-on', category: 'flooringTiles', unit: 'meter' },
  { id: 'laminateFloor', label: 'פרקט למינציה', icon: 'view-week', category: 'flooringTiles', unit: 'meter' },
  { id: 'woodFloor', label: 'פרקט עץ אמיתי', icon: 'view-week', category: 'flooringTiles', unit: 'meter' },
  { id: 'pvcFloor', label: 'PVC ויניל', icon: 'view-week', category: 'flooringTiles', unit: 'meter' },
  { id: 'tileGlue', label: 'דבק לאריחים (שק 25 ק"ג)', icon: 'inventory-2', category: 'flooringTiles', unit: 'piece' },
  { id: 'grout5kg', label: 'רובה (5 ק"ג)', icon: 'inventory-2', category: 'flooringTiles', unit: 'piece' },
  { id: 'aluminumProfile', label: 'פרופיל אלומיניום סף', icon: 'linear-scale', category: 'flooringTiles', unit: 'piece' },

  // ============ שיפוצניק — חומרי בניין ============
  { id: 'cementGray50', label: 'מלט אפור (50 ק"ג)', icon: 'inventory', category: 'buildMaterials', unit: 'piece' },
  { id: 'cementWhite25', label: 'מלט לבן (25 ק"ג)', icon: 'inventory', category: 'buildMaterials', unit: 'piece' },
  { id: 'sandTon', label: 'חול שטוף (טון)', icon: 'landscape', category: 'buildMaterials', unit: 'piece' },
  { id: 'gravelTon', label: 'חצץ (טון)', icon: 'landscape', category: 'buildMaterials', unit: 'piece' },
  { id: 'plasterHand', label: 'גבס ידני (25 ק"ג)', icon: 'inventory', category: 'buildMaterials', unit: 'piece' },
  { id: 'mortar25', label: 'טיט (25 ק"ג)', icon: 'inventory', category: 'buildMaterials', unit: 'piece' },
  { id: 'block20', label: 'בלוק 20', icon: 'view-module', category: 'buildMaterials', unit: 'piece' },
  { id: 'block10', label: 'בלוק 10', icon: 'view-module', category: 'buildMaterials', unit: 'piece' },
  { id: 'rebar12', label: 'מוט ברזל 12 מ"מ (6 מ׳)', icon: 'linear-scale', category: 'buildMaterials', unit: 'piece' },

  // ============ שיפוצניק — מתכלים וכלים ============
  { id: 'cuttingDisc115', label: 'דיסק חיתוך 115 מ"מ', icon: 'circle', category: 'toolConsumables', unit: 'piece' },
  { id: 'diamondDisc115', label: 'דיסק יהלום 115 מ"מ', icon: 'circle', category: 'toolConsumables', unit: 'piece' },
  { id: 'sandpaperSheet', label: 'נייר זכוכית (יחידה)', icon: 'crop-square', category: 'toolConsumables', unit: 'piece' },
  { id: 'paintBrush2', label: 'מברשת צבע 2"', icon: 'brush', category: 'toolConsumables', unit: 'piece' },
  { id: 'paintBrush3', label: 'מברשת צבע 3"', icon: 'brush', category: 'toolConsumables', unit: 'piece' },
  { id: 'paintRoller', label: 'גלגלת צבע + ידית', icon: 'brush', category: 'toolConsumables', unit: 'piece' },
  { id: 'nylonCover', label: 'מסך הגנה ניילון', icon: 'view-quilt', category: 'toolConsumables', unit: 'piece' },
  { id: 'maskingTape', label: 'מסקנטייפ (גליל)', icon: 'colorize', category: 'toolConsumables', unit: 'piece' },
  { id: 'utilityBlade', label: 'להב סכין יפנית (5 יח׳)', icon: 'content-cut', category: 'toolConsumables', unit: 'piece' },
  { id: 'siliconeCartridge', label: 'דבק סיליקון (שפופרת)', icon: 'colorize', category: 'toolConsumables', unit: 'piece' },
  { id: 'puFoam', label: 'קצף PU מבודד', icon: 'opacity', category: 'toolConsumables', unit: 'piece' },

  // ============================================================
  // ============ אינסטלטור — תוספות עומק 2026-06-04 ============
  // צנרת מים — גדלים נוספים וחיבורים
  { id: 'pipePex32', label: 'צינור PEX 32', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipePex40', label: 'צינור PEX 40', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeCopper18', label: 'צינור נחושת 18 מ"מ', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeCopper28', label: 'צינור נחושת 28 מ"מ', icon: 'linear-scale', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeHdpe50', label: 'צינור פוליאתילן 50', icon: 'waves', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pipeHdpe63', label: 'צינור פוליאתילן 63', icon: 'waves', category: 'plumbingPipes', unit: 'meter' },
  { id: 'pexElbow16', label: 'זווית PEX 16', icon: 'turn-right', category: 'plumbingPipes', unit: 'piece' },
  { id: 'pexElbow20', label: 'זווית PEX 20', icon: 'turn-right', category: 'plumbingPipes', unit: 'piece' },
  { id: 'pexTee16', label: 'מחבר T - PEX 16', icon: 'call-split', category: 'plumbingPipes', unit: 'piece' },
  { id: 'pexTee20', label: 'מחבר T - PEX 20', icon: 'call-split', category: 'plumbingPipes', unit: 'piece' },
  { id: 'pexCoupler', label: 'מצמד PEX', icon: 'compare-arrows', category: 'plumbingPipes', unit: 'piece' },
  { id: 'copperElbow15', label: 'זווית נחושת 15 מ"מ', icon: 'turn-right', category: 'plumbingPipes', unit: 'piece' },
  { id: 'copperTee15', label: 'מחבר T נחושת 15', icon: 'call-split', category: 'plumbingPipes', unit: 'piece' },
  { id: 'teflonTape', label: 'סרט טפלון לאטימה', icon: 'colorize', category: 'plumbingPipes', unit: 'piece' },
  { id: 'mainShutoffValve', label: 'ברז ניתוק ראשי לבית', icon: 'power-settings-new', category: 'plumbingPipes', unit: 'piece' },

  // ברזים — תוספות
  { id: 'faucetKitchen3Way', label: 'ברז מטבח 3 דרכים (לפילטר)', icon: 'kitchen', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'faucetSensor', label: 'ברז כיור חיישן (אינפרא)', icon: 'sensors', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'faucetConcealed', label: 'מערבל אמבטיה מוסתר', icon: 'bathtub', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'ballValveOneAndQuarter', label: 'ברז כדורי 1.25"', icon: 'radio-button-checked', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'flexHoseLong', label: 'גמיש 1/2" (60 ס"מ)', icon: 'linear-scale', category: 'plumbingFaucets', unit: 'piece' },
  { id: 'nonReturnValveHalf', label: 'שסתום אל-חוזר 1/2"', icon: 'sync-alt', category: 'plumbingFaucets', unit: 'piece' },

  // ניקוז וביוב — תוספות
  { id: 'sewerPipe75', label: 'צינור ביוב 75 מ"מ', icon: 'linear-scale', category: 'plumbingDrains', unit: 'meter' },
  { id: 'sewerPipe160', label: 'צינור ביוב 160 מ"מ', icon: 'linear-scale', category: 'plumbingDrains', unit: 'meter' },
  { id: 'linearShowerDrain', label: 'מחסום מקלחת לינארי', icon: 'view-stream', category: 'plumbingDrains', unit: 'piece' },
  { id: 'kitchenStrainer', label: 'מחסום מטבח (סבכת מטבח)', icon: 'filter-list', category: 'plumbingDrains', unit: 'piece' },
  { id: 'toiletFlexHose', label: 'חיבור גמיש לאסלה', icon: 'linear-scale', category: 'plumbingDrains', unit: 'piece' },
  { id: 'manhole60', label: 'שוחה 60 ס"מ + מכסה', icon: 'circle', category: 'plumbingDrains', unit: 'piece' },

  // אמבטיה ושירותים — תוספות
  { id: 'concealedToiletFrame', label: 'מסגרת לאסלה תלויה (Geberit)', icon: 'inventory-2', category: 'plumbingBath', unit: 'piece' },
  { id: 'vanityCabinet', label: 'ארון אמבטיה', icon: 'inventory-2', category: 'plumbingBath', unit: 'piece' },
  { id: 'vanityMirror', label: 'מראה לארון אמבטיה', icon: 'crop-square', category: 'plumbingBath', unit: 'piece' },

  // חימום מים — תוספות
  { id: 'boilerSafetyValve', label: 'שסתום ביטחון לדוד', icon: 'shield', category: 'plumbingWater', unit: 'piece' },
  { id: 'sacrificialAnode', label: 'אנודה לדוד (החלפה)', icon: 'science', category: 'plumbingWater', unit: 'piece' },
  { id: 'underFloorManifold', label: 'קולטור לחימום תת-רצפתי', icon: 'view-module', category: 'plumbingFloor', unit: 'piece' },
  { id: 'instantWaterHeater', label: 'מחמם מים מיידי (חשמלי)', icon: 'hot-tub', category: 'plumbingWater', unit: 'piece' },

  // ============================================================
  // ============ איש תקשורת — תוספות עומק 2026-06-04 ============
  // כבילה — תוספות
  { id: 'cableAlarm6', label: 'כבל אזעקה 6 גידים', icon: 'cable', category: 'commsCabling', unit: 'meter' },
  { id: 'cableAlarm8', label: 'כבל אזעקה 8 גידים', icon: 'cable', category: 'commsCabling', unit: 'meter' },
  { id: 'cableIntercom', label: 'כבל אינטרקום', icon: 'cable', category: 'commsCabling', unit: 'meter' },
  { id: 'cableAccessControl', label: 'כבל בקרת כניסה', icon: 'cable', category: 'commsCabling', unit: 'meter' },
  { id: 'fiberOm4', label: 'סיב אופטי OM4', icon: 'linear-scale', category: 'commsCabling', unit: 'meter' },
  { id: 'fiberPigtailSc', label: 'Pigtail SC סיב אופטי', icon: 'extension', category: 'commsCabling', unit: 'piece' },
  { id: 'fiberPigtailLc', label: 'Pigtail LC סיב אופטי', icon: 'extension', category: 'commsCabling', unit: 'piece' },
  { id: 'cableFireResistant', label: 'כבל עמיד אש', icon: 'local-fire-department', category: 'commsCabling', unit: 'meter' },

  // שקעים ופאנלים — תוספות
  { id: 'jackCat6aDouble', label: 'שקע CAT6a כפול', icon: 'settings-input-component', category: 'commsJacks', unit: 'piece' },
  { id: 'patchPanel12', label: 'פאנל פאצ\' 12 פורט', icon: 'view-module', category: 'commsJacks', unit: 'piece' },
  { id: 'patchPanel16', label: 'פאנל פאצ\' 16 פורט', icon: 'view-module', category: 'commsJacks', unit: 'piece' },
  { id: 'cableManager1u', label: 'מארגן כבלים 1U', icon: 'view-day', category: 'commsJacks', unit: 'piece' },
  { id: 'patchCordHalf', label: 'פאצ\' קורד CAT6 (0.5 מ׳)', icon: 'cable', category: 'commsJacks', unit: 'piece' },
  { id: 'patchCord3m', label: 'פאצ\' קורד CAT6 (3 מ׳)', icon: 'cable', category: 'commsJacks', unit: 'piece' },
  { id: 'patchCord5m', label: 'פאצ\' קורד CAT6 (5 מ׳)', icon: 'cable', category: 'commsJacks', unit: 'piece' },
  { id: 'wallSocketHdmi', label: 'שקע HDMI לקיר', icon: 'settings-input-hdmi', category: 'commsJacks', unit: 'piece' },
  { id: 'wallSocketUsb', label: 'שקע USB טעינה לקיר', icon: 'usb', category: 'commsJacks', unit: 'piece' },

  // ציוד פעיל — תוספות
  { id: 'switch5', label: 'מתג 5 פורט', icon: 'hub', category: 'commsActive', unit: 'piece' },
  { id: 'switch16', label: 'מתג 16 פורט', icon: 'hub', category: 'commsActive', unit: 'piece' },
  { id: 'switch24Poe', label: 'מתג 24 פורט PoE', icon: 'hub', category: 'commsActive', unit: 'piece' },
  { id: 'router4g', label: 'ראוטר 4G/LTE', icon: 'router', category: 'commsActive', unit: 'piece' },
  { id: 'router5g', label: 'ראוטר 5G', icon: 'router', category: 'commsActive', unit: 'piece' },
  { id: 'wifiExtender', label: 'אקסטנדר WiFi', icon: 'wifi', category: 'commsActive', unit: 'piece' },
  { id: 'fiberOnt', label: 'מודם סיב אופטי (ONT)', icon: 'router', category: 'commsActive', unit: 'piece' },
  { id: 'ups1500', label: 'אל-פסק 1500VA', icon: 'battery-charging-full', category: 'commsActive', unit: 'piece' },
  { id: 'powerSupply12v', label: 'ספק כוח 12V למצלמות', icon: 'power', category: 'commsActive', unit: 'piece' },
  { id: 'accessPointOutdoor', label: 'Access Point חיצוני', icon: 'wifi-tethering', category: 'commsActive', unit: 'piece' },

  // ארונות — תוספות
  { id: 'rack9u', label: 'ארון תקשורת 9U', icon: 'dns', category: 'commsCabinets', unit: 'piece' },
  { id: 'rack15u', label: 'ארון תקשורת 15U', icon: 'dns', category: 'commsCabinets', unit: 'piece' },

  // מצלמות ואבטחה — תוספות
  { id: 'ipCameraBullet', label: 'מצלמת IP Bullet', icon: 'videocam', category: 'commsCctv', unit: 'piece' },
  { id: 'ipCameraDome', label: 'מצלמת IP Dome', icon: 'videocam', category: 'commsCctv', unit: 'piece' },
  { id: 'nvr32', label: 'NVR 32 ערוצים', icon: 'storage', category: 'commsCctv', unit: 'piece' },
  { id: 'alarmPanel', label: 'מערכת אזעקה ביתית', icon: 'security', category: 'commsAlarm', unit: 'piece' },
  { id: 'motionSensorWired', label: 'חיישן תנועה לאזעקה', icon: 'sensors', category: 'commsAlarm', unit: 'piece' },
  { id: 'doorContact', label: 'חיישן מגנט לדלת/חלון', icon: 'sensor-door', category: 'commsAlarm', unit: 'piece' },
  { id: 'alarmSiren', label: 'צופר אזעקה', icon: 'volume-up', category: 'commsAlarm', unit: 'piece' },
  { id: 'alarmKeypad', label: 'מקלדת אזעקה', icon: 'dialpad', category: 'commsAlarm', unit: 'piece' },
  { id: 'magneticLock', label: 'מנעול מגנט לבקרת כניסה', icon: 'lock', category: 'commsAccess', unit: 'piece' },
  { id: 'exitButton', label: 'לחצן יציאה', icon: 'logout', category: 'commsAccess', unit: 'piece' },
  { id: 'fireSmokeProDetector', label: 'גלאי עשן מקצועי (מערכת אש)', icon: 'detector-smoke', category: 'commsAlarm', unit: 'piece' },
  { id: 'fireHeatDetector', label: 'גלאי חום מקצועי', icon: 'thermostat', category: 'commsAlarm', unit: 'piece' },

  // ============================================================
  // ============ שיפוצניק — תוספות עומק 2026-06-04 ============
  // צבע — תוספות
  { id: 'paintMetal', label: 'צבע מתכת (גלון)', icon: 'format-paint', category: 'paintPrimers', unit: 'piece' },
  { id: 'paintRoof', label: 'צבע גג (גלון)', icon: 'roofing', category: 'paintPrimers', unit: 'piece' },
  { id: 'paintExteriorAcrylic', label: 'אקרילי חוץ (גלון)', icon: 'format-paint', category: 'paintPrimers', unit: 'piece' },
  { id: 'paintCeiling', label: 'צבע תקרה (גלון)', icon: 'format-paint', category: 'paintPrimers', unit: 'piece' },
  { id: 'paintWaterproof', label: 'איטום קיר (גלון)', icon: 'water-damage', category: 'paintPrimers', unit: 'piece' },
  { id: 'wallSealer', label: 'חורש - מדבק קיר', icon: 'opacity', category: 'paintPrimers', unit: 'piece' },

  // גבס וקירות — תוספות
  { id: 'gypsumBoardThin', label: 'לוח גבס 9.5 מ"מ', icon: 'view-day', category: 'gypsumWalls', unit: 'piece' },
  { id: 'gypsumBoardAcoustic', label: 'לוח גבס אקוסטי', icon: 'view-day', category: 'gypsumWalls', unit: 'piece' },
  { id: 'profileCw100', label: 'פרופיל CW100 (3 מ׳)', icon: 'linear-scale', category: 'gypsumWalls', unit: 'piece' },
  { id: 'profileUw100', label: 'פרופיל UW100 (3 מ׳)', icon: 'linear-scale', category: 'gypsumWalls', unit: 'piece' },
  { id: 'concreteScrews', label: 'ברגי בטון לגבס (קופסה)', icon: 'settings', category: 'gypsumWalls', unit: 'piece' },
  { id: 'acousticInsulation', label: 'בידוד אקוסטי לקיר (גליל)', icon: 'blur-on', category: 'buildInsulation', unit: 'piece' },
  { id: 'quickSpackle', label: 'שפכטל מהיר ייבוש (5 ק"ג)', icon: 'inventory-2', category: 'gypsumWalls', unit: 'piece' },
  { id: 'nylonDowel', label: 'דיבל פלסטיק (קופסה)', icon: 'extension', category: 'gypsumWalls', unit: 'piece' },
  { id: 'concreteAnchor', label: 'אנקור לבטון (10 יח׳)', icon: 'anchor', category: 'gypsumWalls', unit: 'piece' },

  // ריצוף וקרמיקה — תוספות
  { id: 'tileCer2020', label: 'אריח קרמיקה 20×20', icon: 'grid-on', category: 'flooringTiles', unit: 'meter' },
  { id: 'tileCer4040', label: 'אריח קרמיקה 40×40', icon: 'grid-on', category: 'flooringTiles', unit: 'meter' },
  { id: 'tileWall2540', label: 'אריח קיר 25×40', icon: 'grid-on', category: 'flooringTiles', unit: 'meter' },
  { id: 'mosaicTile', label: 'מוזאיקה (מ"ר)', icon: 'apps', category: 'flooringTiles', unit: 'meter' },
  { id: 'naturalStone', label: 'אריח אבן טבעית', icon: 'landscape', category: 'flooringTiles', unit: 'meter' },
  { id: 'spcFloor', label: 'פרקט SPC', icon: 'view-week', category: 'flooringTiles', unit: 'meter' },
  { id: 'transitionProfile', label: 'פרופיל מעבר אלומיניום', icon: 'linear-scale', category: 'flooringTiles', unit: 'piece' },
  { id: 'tileSpacers', label: 'מרווחים לאריחים (חבילה)', icon: 'apps', category: 'flooringTiles', unit: 'piece' },
  { id: 'tileLevelingClip', label: 'קליפסים לפילוס אריחים (100 יח׳)', icon: 'horizontal-rule', category: 'flooringTiles', unit: 'piece' },

  // חומרי בניין — תוספות
  { id: 'quickCement', label: 'מלט מהיר (5 ק"ג)', icon: 'inventory', category: 'buildMaterials', unit: 'piece' },
  { id: 'readyMixConcrete', label: 'בטון מוכן (מ"ק)', icon: 'inventory', category: 'buildMaterials', unit: 'piece' },
  { id: 'block15', label: 'בלוק 15', icon: 'view-module', category: 'buildMaterials', unit: 'piece' },
  { id: 'block7', label: 'בלוק 7', icon: 'view-module', category: 'buildMaterials', unit: 'piece' },
  { id: 'blockYtong', label: 'בלוק איטונג', icon: 'view-module', category: 'buildMaterials', unit: 'piece' },
  { id: 'rebar8', label: 'מוט ברזל 8 מ"מ (6 מ׳)', icon: 'linear-scale', category: 'buildMaterials', unit: 'piece' },
  { id: 'rebar10', label: 'מוט ברזל 10 מ"מ (6 מ׳)', icon: 'linear-scale', category: 'buildMaterials', unit: 'piece' },
  { id: 'rebar14', label: 'מוט ברזל 14 מ"מ (6 מ׳)', icon: 'linear-scale', category: 'buildMaterials', unit: 'piece' },
  { id: 'weldMesh', label: 'רשת ברזל מרותכת', icon: 'grid-4x4', category: 'buildMaterials', unit: 'meter' },
  { id: 'bitumenSheet', label: 'יריעה ביטומנית (מ"ר)', icon: 'water-damage', category: 'buildMaterials', unit: 'meter' },
  { id: 'windowPvc', label: 'חלון PVC (מ"ר)', icon: 'window', category: 'buildOpenings', unit: 'meter' },
  { id: 'windowScreen', label: 'מסך לחלון (מ"ר)', icon: 'grid-4x4', category: 'buildOpenings', unit: 'meter' },
  { id: 'doorKitchen', label: 'דלת מטבח', icon: 'door-front', category: 'buildOpenings', unit: 'piece' },
  { id: 'doorHandle', label: 'ידית לדלת', icon: 'pan-tool', category: 'buildOpenings', unit: 'piece' },
  { id: 'doorLock', label: 'מנעול לדלת', icon: 'lock', category: 'buildOpenings', unit: 'piece' },
  { id: 'doorHinge', label: 'ציר לדלת (זוג)', icon: 'all-out', category: 'buildOpenings', unit: 'piece' },

  // מתכלים וכלים — תוספות
  { id: 'cuttingDisc230', label: 'דיסק חיתוך 230 מ"מ', icon: 'circle', category: 'toolConsumables', unit: 'piece' },
  { id: 'diamondDisc230', label: 'דיסק יהלום 230 מ"מ', icon: 'circle', category: 'toolConsumables', unit: 'piece' },
  { id: 'sdsBit8', label: 'מקדח SDS 8 מ"מ', icon: 'linear-scale', category: 'toolConsumables', unit: 'piece' },
  { id: 'sdsBit10', label: 'מקדח SDS 10 מ"מ', icon: 'linear-scale', category: 'toolConsumables', unit: 'piece' },
  { id: 'sdsBit12', label: 'מקדח SDS 12 מ"מ', icon: 'linear-scale', category: 'toolConsumables', unit: 'piece' },
  { id: 'drillMetal6', label: 'מקדח למתכת 6 מ"מ', icon: 'linear-scale', category: 'toolConsumables', unit: 'piece' },
  { id: 'workGloves', label: 'כפפות עבודה (זוג)', icon: 'pan-tool', category: 'safetyGear', unit: 'piece' },
  { id: 'safetyGoggles', label: 'משקפי מגן', icon: 'visibility', category: 'safetyGear', unit: 'piece' },
  { id: 'dustMask', label: 'מסכת אבק (10 יח׳)', icon: 'masks', category: 'safetyGear', unit: 'piece' },
  { id: 'earProtection', label: 'אוזניות אקוסטיות', icon: 'hearing', category: 'safetyGear', unit: 'piece' },
  { id: 'safetyHelmet', label: 'קסדת בטיחות', icon: 'sports-motorsports', category: 'safetyGear', unit: 'piece' },
  { id: 'measuringTape5m', label: 'מטר נמתח 5 מ׳', icon: 'straighten', category: 'safetyGear', unit: 'piece' },
  { id: 'laserLevel', label: 'מד פלס לייזר', icon: 'gradient', category: 'safetyGear', unit: 'piece' },
];

export const FAMILIES = [
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

export function categoriesForProfession(professionId) {
  if (!professionId) return CATEGORIES;
  return CATEGORIES.filter((c) => !c.professions || c.professions.includes(professionId));
}

export function itemBelongsToProfession(item, professionId) {
  if (!professionId || !item) return true;
  const cat = CATEGORIES.find((c) => c.id === item.category);
  if (!cat || !cat.professions) return true;
  return cat.professions.includes(professionId);
}

export const VAT_RATE = 0.18;
