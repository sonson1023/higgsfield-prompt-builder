/**
 * Preview images for chips.
 * Photo chips → Unsplash (stable photo IDs). Abstract → bundled SVGs.
 * Base path is handled by Vite import.meta.env.BASE_URL.
 */

const U = (id: string, extra = '') =>
  `https://images.unsplash.com/${id}?w=400&q=80&auto=format&fit=crop${extra}`;

const base = () => {
  const raw =
    (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) ||
    '/higgsfield-prompt-builder/';
  return raw.endsWith('/') ? raw : `${raw}/`;
};

/** Join BASE_URL + relative path without double slashes (GitHub Pages safe) */
const local = (path: string) => `${base()}${path.replace(/^\/+/, '')}`;

export interface PreviewMeta {
  previewUrl?: string;
  /** CSS gradient fallback */
  previewTone?: string;
}

/** Category default tones when no URL */
export const CATEGORY_TONES: Record<string, string> = {
  subject: 'linear-gradient(135deg,#3b2a6e,#7c5cff)',
  personDetail: 'linear-gradient(135deg,#4c1d95,#db2777)',
  pose: 'linear-gradient(135deg,#6d28d9,#f472b6)',
  scene: 'linear-gradient(135deg,#0f766e,#1e3a5f)',
  composition: 'linear-gradient(135deg,#1e293b,#6366f1)',
  lens: 'linear-gradient(135deg,#334155,#94a3b8)',
  lighting: 'linear-gradient(135deg,#b45309,#fbbf24)',
  colorGrade: 'linear-gradient(135deg,#7c2d12,#a855f7)',
  atmosphere: 'linear-gradient(135deg,#0e7490,#67e8f9)',
  style: 'linear-gradient(135deg,#581c87,#ec4899)',
  mood: 'linear-gradient(135deg,#312e81,#818cf8)',
  quality: 'linear-gradient(135deg,#14532d,#4ade80)',
  avoid: 'linear-gradient(135deg,#7f1d1d,#f87171)',
  action: 'linear-gradient(135deg,#5b21b6,#c4b5fd)',
  cameraMove: 'linear-gradient(135deg,#1e1b4b,#a78bfa)',
  timing: 'linear-gradient(135deg,#1e3a5f,#60a5fa)',
  pacing: 'linear-gradient(135deg,#164e63,#22d3ee)',
  audio: 'linear-gradient(135deg,#4a044e,#e879f9)',
};

/**
 * Chip id → preview. Cover visual categories thoroughly.
 * Local SVGs for camera / timing / audio / quality / avoid.
 */
export const PREVIEW_BY_ID: Record<string, PreviewMeta> = {
  // —— Subject ——
  'sub-woman': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },
  'sub-man': { previewUrl: U('photo-1506794778202-cad84cf45f1d') },
  'sub-couple': { previewUrl: U('photo-1516589178581-6cd7833ae3b2') },
  'sub-product': { previewUrl: U('photo-1523275335684-37898b6baf30') },
  'sub-food': { previewUrl: U('photo-1546069901-ba9599a7e63c') },
  'sub-car': { previewUrl: U('photo-1492144534655-ae79c964c9d7') },
  'sub-cityscape': { previewUrl: U('photo-1477959858617-67f85cf4f1df') },
  'sub-interior': { previewUrl: U('photo-1618221195710-dd6b41faaea6') },
  'sub-fashion': { previewUrl: U('photo-1509631179647-0177331693ae') },
  'sub-pet': { previewUrl: U('photo-1543466835-00a7907e9de1') },
  'sub-hands': { previewUrl: U('photo-1587654780291-39c9404d746b') },

  'sub-camera-body': { previewUrl: U('photo-1502920917128-1aa500764cbd') },
  'pose-hands-chest-cam': { previewUrl: U('photo-1587654780291-39c9404d746b') },
  'pose-hands-only': { previewUrl: U('photo-1587654780291-39c9404d746b') },
  'comp-chest-cam-pov': { previewTone: CATEGORY_TONES.composition },
  'comp-hands-only': { previewUrl: U('photo-1587654780291-39c9404d746b') },


  // —— Person detail ——
  'pd-east-asian': { previewUrl: U('photo-1534528741775-53994a69daeb') },
  'pd-natural-makeup': { previewUrl: U('photo-1515886657613-9f3515b0c78f') },
  'pd-bold-makeup': { previewUrl: U('photo-1522335789203-aabd1fc54bc9') },
  'pd-wavy-hair': { previewUrl: U('photo-1522337360788-8b13dee7a37e') },
  'pd-short-hair': { previewUrl: U('photo-1507003211169-0a1dd7228f2d') },
  'pd-elegant-outfit': { previewUrl: U('photo-1496747611176-843222e1e57c') },
  'pd-streetwear': { previewUrl: U('photo-1529139574466-a303027c1d8b') },
  'pd-formal': { previewUrl: U('photo-1507679799987-c73779587ccf') },
  'pd-casual': { previewUrl: U('photo-1515886657613-9f3515b0c78f') },
  'pd-confident': { previewUrl: U('photo-1531746020798-e6953c6e8e04') },
  'pd-soft-gaze': { previewUrl: U('photo-1544005313-94ddf0286df2') },
  'pd-skin-glow': { previewUrl: U('photo-1616394584738-fc6e612e71b9') },
  'pd-age-20s': { previewUrl: U('photo-1524504388940-b1c1722653e1') },
  'pd-age-30s': { previewUrl: U('photo-1500648767791-00dcc994a43e') },
  'pd-age-40s': { previewUrl: U('photo-1472099645785-5658abf4ff4e') },
  'pd-half-body': { previewUrl: U('photo-1469334031218-e382a71b716b') },
  'pd-three-quarter': { previewUrl: U('photo-1488426862026-3ee34a7d66df') },

  // —— Scene ——
  'sc-studio': { previewUrl: U('photo-1558618666-fcd25c85cd64') },
  'sc-cafe': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },
  'sc-street': { previewUrl: U('photo-1449824913935-59a10b8d2000') },
  'sc-rooftop': { previewUrl: U('photo-1480714378408-67cf0d13bc1b') },
  'sc-night-city': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'sc-beach': { previewUrl: U('photo-1507525428034-b723cf961d3e') },
  'sc-forest': { previewUrl: U('photo-1441974231531-c6227db76b6e') },
  'sc-luxury-room': { previewUrl: U('photo-1631049307264-da0ec9d70304') },
  'sc-kitchen': { previewUrl: U('photo-1556912173-46c336c7fd55') },
  'sc-runway': { previewUrl: U('photo-1558171813-4c088753af8f') },
  'sc-garage': { previewUrl: U('photo-1503376780353-7e6692767b70') },
  'sc-minimal-bg': { previewUrl: U('photo-1618005182384-a83a8bd57fbe') },
  'sc-rainy-seoul': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'sc-subway': { previewUrl: U('photo-1555431189-0fabf2667795') },
  'sc-bookstore': { previewUrl: U('photo-1481627834876-b7833e8f5570') },
  'sc-gym': { previewUrl: U('photo-1534438327276-14e5300c3a48') },
  'sc-office-lobby': { previewUrl: U('photo-1497366216548-37526070297c') },
  'sc-cherry-park': { previewUrl: U('photo-1522383225653-ed111181a951') },
  'sc-hanok-alley': { previewUrl: U('photo-1540959733332-eab4deabeeaf') },
  'sc-desert-road': { previewUrl: U('photo-1509316785289-025f5b846b35') },
  'sc-foggy-mountain': { previewUrl: U('photo-1464822759023-fed622ff2c3b') },
  'sc-rainy-window': { previewUrl: U('photo-1515694346937-94d85e41e6f0') },

  // —— Composition ——

  // —— Lens ——
  'lens-35': { previewUrl: U('photo-1452587925148-ce544e77e70d') },
  'lens-50': { previewUrl: U('photo-1516035069371-29a1b244cc32') },
  'lens-85': { previewUrl: U('photo-1492691527719-9d1e07e534b4') },
  'lens-anamorphic': { previewUrl: U('photo-1485846234645-a62644f84728') },
  'lens-shallow': { previewUrl: U('photo-1490750967868-88aa4486c946') },
  'lens-bokeh': { previewUrl: U('photo-1519681393784-d120267933ba') },
  'lens-film-grain': { previewUrl: U('photo-1478720568477-152d9b164e26') },
  'lens-sharp': { previewUrl: U('photo-1506905925346-21bda4d32df4') },

  // —— Lighting ——
  'lit-softbox': { previewUrl: U('photo-1558618666-fcd25c85cd64') },
  'lit-golden': { previewUrl: U('photo-1495616811223-4d98c6e9c869') },
  'lit-neon': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'lit-rim': { previewUrl: U('photo-1534528741775-53994a69daeb') },
  'lit-natural': { previewUrl: U('photo-1493663284031-b7e3aefcae8e') },
  'lit-moody': { previewUrl: U('photo-1516035069371-29a1b244cc32') },
  'lit-highkey': { previewUrl: U('photo-1616394584738-fc6e612e71b9') },
  'lit-candle': { previewUrl: U('photo-1514933651103-005eec06c04b') },
  'lit-volumetric': { previewUrl: U('photo-1464822759023-fed622ff2c3b') },
  'lit-practical': { previewUrl: U('photo-1493663284031-b7e3aefcae8e') },
  'lit-backlight': { previewUrl: U('photo-1492691527719-9d1e07e534b4') },

  // —— Color grade ——
  'cg-warm-amber': { previewUrl: U('photo-1506905925346-21bda4d32df4') },
  'cg-cool-blue': { previewUrl: U('photo-1419242902214-272b3f66ee7a') },
  'cg-muted-filmic': { previewUrl: U('photo-1478720568477-152d9b164e26') },
  'cg-bw-contrast': { previewUrl: U('photo-1492691527719-9d1e07e534b4') },
  'cg-soft-pastel': { previewUrl: U('photo-1490750967868-88aa4486c946') },
  'cg-cyberpunk': { previewUrl: U('photo-1519501025264-65ba15a82390') },

  // —— Atmosphere ——
  'atm-rain': { previewUrl: U('photo-1515694346937-94d85e41e6f0') },
  'atm-fog': { previewUrl: U('photo-1439405326854-014607f694d7') },
  'atm-dust': { previewUrl: U('photo-1464822759023-fed622ff2c3b') },
  'atm-snow': { previewUrl: U('photo-1491002052546-bf38f186af56') },
  'atm-heat': { previewUrl: U('photo-1509316785289-025f5b846b35') },
  'atm-steam': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },

  // —— Style ——
  'st-cinematic': { previewUrl: U('photo-1485846234645-a62644f84728') },
  'st-editorial': { previewUrl: U('photo-1509631179647-0177331693ae') },
  'st-photoreal': { previewUrl: U('photo-1534528741775-53994a69daeb') },
  'st-minimal': { previewUrl: U('photo-1618005182384-a83a8bd57fbe') },
  'st-vintage': { previewUrl: U('photo-1478720568477-152d9b164e26') },
  'st-commercial': { previewUrl: U('photo-1523275335684-37898b6baf30') },
  'st-documentary': { previewUrl: U('photo-1452587925148-ce544e77e70d') },
  'st-luxury': { previewUrl: U('photo-1523275335684-37898b6baf30') },
  'st-street': { previewUrl: U('photo-1449824913935-59a10b8d2000') },
  'st-food': { previewUrl: U('photo-1546069901-ba9599a7e63c') },

  // —— Mood ——
  'mood-calm': { previewUrl: U('photo-1507525428034-b723cf961d3e') },
  'mood-dramatic': { previewUrl: U('photo-1516035069371-29a1b244cc32') },
  'mood-romantic': { previewUrl: U('photo-1516589178581-6cd7833ae3b2') },
  'mood-energetic': { previewUrl: U('photo-1470229722913-7c0e2dbbafd3') },
  'mood-mysterious': { previewUrl: U('photo-1516035069371-29a1b244cc32') },
  'mood-elegant': { previewUrl: U('photo-1496747611176-843222e1e57c') },
  'mood-cozy': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },
  'mood-futuristic': { previewUrl: U('photo-1518770660439-4636190af475') },
  'mood-nostalgic': { previewUrl: U('photo-1478720568477-152d9b164e26') },
  'mood-powerful': { previewUrl: U('photo-1492144534655-ae79c964c9d7') },
  'mood-dreamy': { previewUrl: U('photo-1519681393784-d120267933ba') },
  'mood-tense': { previewUrl: U('photo-1478720568477-152d9b164e26') },

  // —— Quality (SVG) ——
  'q-8k': { previewUrl: local('previews/abstract/q-8k.svg') },
  'q-detail': { previewUrl: local('previews/abstract/q-detail.svg') },
  'q-color': { previewUrl: local('previews/abstract/q-color.svg') },
  'q-texture': { previewUrl: local('previews/abstract/q-texture.svg') },
  'q-professional': { previewUrl: local('previews/abstract/q-pro.svg') },
  'q-clean': { previewUrl: local('previews/abstract/q-clean.svg') },
  'q-dynamic-range': { previewUrl: local('previews/abstract/q-hdr.svg') },
  'q-natural': { previewUrl: local('previews/abstract/q-natural.svg') },

  // —— Avoid (SVG) ——
  'av-blur': { previewUrl: local('previews/abstract/av-blur.svg') },
  'av-distort': { previewUrl: local('previews/abstract/av-distort.svg') },
  'av-watermark': { previewUrl: local('previews/abstract/av-watermark.svg') },
  'av-text': { previewUrl: local('previews/abstract/av-text.svg') },
  'av-lowres': { previewUrl: local('previews/abstract/av-lowres.svg') },
  'av-overexposed': { previewUrl: local('previews/abstract/av-over.svg') },
  'av-clutter': { previewUrl: local('previews/abstract/av-clutter.svg') },
  'av-plastic': { previewUrl: local('previews/abstract/av-plastic.svg') },

  // —— Action (mix photo + abstract) ——
  'act-walk': { previewUrl: U('photo-1524504388940-b1c1722653e1') },
  'act-turn': { previewUrl: U('photo-1531746020798-e6953c6e8e04') },
  'act-smile': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },
  'act-hair': { previewUrl: U('photo-1522337360788-8b13dee7a37e') },
  'act-lookaway': { previewUrl: U('photo-1544005313-94ddf0286df2') },
  'act-sip': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },
  'act-reveal': { previewUrl: U('photo-1523275335684-37898b6baf30') },
  'act-drive': { previewUrl: U('photo-1492144534655-ae79c964c9d7') },
  'act-steam': { previewUrl: U('photo-1546069901-ba9599a7e63c') },
  'act-lights': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'act-approach': { previewUrl: U('photo-1469334031218-e382a71b716b') },
  'act-pose': { previewUrl: U('photo-1509631179647-0177331693ae') },
  'act-blink': { previewUrl: local('previews/abstract/action.svg'), previewTone: CATEGORY_TONES.action },
  'act-hair-flick': { previewUrl: U('photo-1522337360788-8b13dee7a37e') },
  'act-sip-coffee': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },
  'act-open-door': { previewUrl: U('photo-1497366216548-37526070297c') },
  'act-turn-away': { previewUrl: U('photo-1492691527719-9d1e07e534b4') },
  'act-unbox': { previewUrl: U('photo-1587654780291-39c9404d746b') },
  'act-orbit-product': { previewUrl: U('photo-1523275335684-37898b6baf30') },
  'act-walk-neon': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'act-phone-up': { previewUrl: U('photo-1512941937669-90a1b58e7e9c') },

  // —— Camera moves (SVG diagrams) ——
  'cam-dolly-in': { previewUrl: local('previews/camera/dolly-in.svg') },
  'cam-pull-back': { previewUrl: local('previews/camera/pull-back.svg') },
  'cam-truck': { previewUrl: local('previews/camera/truck.svg') },
  'cam-arc': { previewUrl: local('previews/camera/arc.svg') },
  'cam-crane': { previewUrl: local('previews/camera/crane.svg') },
  'cam-orbital': { previewUrl: local('previews/camera/orbital.svg') },
  'cam-handheld': { previewUrl: local('previews/camera/handheld.svg') },
  'cam-pan': { previewUrl: local('previews/camera/pan.svg') },
  'cam-static': { previewUrl: local('previews/camera/static.svg') },
  'cam-push-slow': { previewUrl: local('previews/camera/push-slow.svg') },
  'cam-whip-soft': { previewUrl: local('previews/camera/whip-soft.svg') },
  'cam-rack-hint': { previewUrl: local('previews/camera/rack-hint.svg') },
  'cam-tripod': { previewUrl: local('previews/camera/tripod.svg') },
  'cam-steadicam': { previewUrl: local('previews/camera/steadicam.svg') },

  // —— Timing / pacing ——
  'time-3s': { previewUrl: local('previews/abstract/time-3s.svg') },
  'time-5s': { previewUrl: local('previews/abstract/time-5s.svg') },
  'time-8s': { previewUrl: local('previews/abstract/time-8s.svg') },
  'time-15s': { previewUrl: local('previews/abstract/time-15s.svg') },
  'time-realtime': { previewUrl: local('previews/abstract/realtime.svg') },
  'time-slow': { previewUrl: local('previews/abstract/slowmo.svg') },

  // —— Audio ——
  'aud-ambient': { previewUrl: local('previews/abstract/audio-ambient.svg') },
  'aud-city': { previewUrl: local('previews/abstract/audio-city.svg') },
  'aud-cafe': { previewUrl: local('previews/abstract/audio-cafe.svg') },
  'aud-wind': { previewUrl: local('previews/abstract/audio-wind.svg') },
  'aud-engine': { previewUrl: local('previews/abstract/audio-engine.svg') },
  'aud-music': { previewUrl: local('previews/abstract/audio-music.svg') },
  'aud-none': { previewUrl: local('previews/abstract/audio-none.svg') },
  'aud-rain-glass': { previewUrl: local('previews/abstract/audio-rain.svg') },
  'aud-piano': { previewUrl: local('previews/abstract/audio-piano.svg') },
  'aud-lipsync': { previewUrl: local('previews/abstract/audio-lipsync.svg') },

  // —— Expanded subjects ——
  'sub-child': { previewUrl: U('photo-1503454537195-1dcabb73ffb9') },
  'sub-senior': { previewUrl: U('photo-1559839734-2b71ea197ec2') },
  'sub-group': { previewUrl: U('photo-1529156069898-49953e39b3ac') },
  'sub-landscape': { previewUrl: U('photo-1506905925346-21bda4d32df4') },
  'sub-architecture': { previewUrl: U('photo-1487958449943-2429e8be8625') },
  'sub-jewelry': { previewUrl: U('photo-1515562141207-7a88fb7ce338') },
  'sub-cosmetics': { previewUrl: U('photo-1596462502278-27bfdc403348') },
  'sub-gadget': { previewUrl: U('photo-1511707171634-5f897ff02aa9') },
  'sub-sneakers': { previewUrl: U('photo-1542291026-7eec264c27ff') },
  'sub-drink': { previewUrl: U('photo-1544145945-f90425340c7e') },

  'pd-long-straight': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },
  'pd-ponytail': { previewUrl: U('photo-1494790108377-be9c29b29330') },
  'pd-beard': { previewUrl: U('photo-1507003211169-0a1dd7228f2d') },
  'pd-glasses': { previewUrl: U('photo-1573496359142-b8d87734a5a2') },
  'pd-hat': { previewUrl: U('photo-1515886657613-9f3515b0c78f') },
  'pd-suit': { previewUrl: U('photo-1507679799987-c73779587ccf') },
  'pd-athleisure': { previewUrl: U('photo-1517836357463-d25dfeac3438') },
  'pd-hanbok-mood': { previewUrl: U('photo-1540959733332-eab4deabeeaf') },
  'pd-wet-hair': { previewUrl: U('photo-1519699047748-de8e457a634e') },
  'pd-post-workout': { previewUrl: U('photo-1534438327276-14e5300c3a48') },
  'pd-neutral-face': { previewUrl: U('photo-1531746020798-e6953c6e8e04') },
  'pd-smile': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },
  'pd-intense-eyes': { previewUrl: U('photo-1534528741775-53994a69daeb') },

  // —— Pose (standing) ——
  'pose-stand-straight': { previewUrl: U('photo-1524504388940-b1c1722653e1') },
  'pose-stand-contrapposto': { previewUrl: U('photo-1531746020798-e6953c6e8e04') },
  'pose-stand-weight-leg': { previewUrl: U('photo-1509631179647-0177331693ae') },
  'pose-stand-wide': { previewUrl: U('photo-1515886657613-9f3515b0c78f') },
  'pose-stand-power': { previewUrl: U('photo-1488426862026-3ee34a7d66df') },
  'pose-stand-pockets': { previewUrl: U('photo-1496747611176-843222e1e57c') },
  'pose-stand-hip': { previewUrl: U('photo-1469334031218-e382a71b716b') },
  'pose-stand-arms-cross': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },
  'pose-stand-behind-back': { previewUrl: U('photo-1507003211169-0a1dd7228f2d') },
  'pose-stand-lean-wall': { previewUrl: U('photo-1534528741775-53994a69daeb') },
  'pose-stand-lean-rail': { previewUrl: U('photo-1494790108377-be9c29b29330') },
  'pose-stand-look-back': { previewUrl: U('photo-1500648767791-00dcc994a43e') },
  'pose-stand-back-cam': { previewUrl: U('photo-1521119989659-a83eee488004') },
  'pose-stand-3quarter': { previewUrl: U('photo-1544005313-94ddf0286df2') },
  'pose-stand-profile': { previewUrl: U('photo-1506794778202-cad84cf45f1d') },
  'pose-stand-phone': { previewUrl: U('photo-1472099645785-5658abf4ff4e') },
  'pose-stand-coffee': { previewUrl: U('photo-1524504388940-b1c1722653e1') },
  'pose-stand-bag': { previewUrl: U('photo-1531746020798-e6953c6e8e04') },
  'pose-stand-wind': { previewUrl: U('photo-1509631179647-0177331693ae') },
  'pose-stand-mirror': { previewUrl: U('photo-1515886657613-9f3515b0c78f') },
  'pose-stand-one-foot': { previewUrl: U('photo-1488426862026-3ee34a7d66df') },
  'pose-stand-tiptoe': { previewUrl: U('photo-1496747611176-843222e1e57c') },
  'pose-stand-crossed-ankles': { previewUrl: U('photo-1469334031218-e382a71b716b') },
  'pose-stand-hands-face': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },


  'sc-convenience-night': { previewUrl: U('photo-1604719312566-8912e9227c6a') },
  'sc-parking': { previewUrl: U('photo-1506521781263-d8422e82f27a') },
  'sc-elevator': { previewUrl: U('photo-1497366216548-37526070297c') },
  'sc-window-seat': { previewUrl: U('photo-1493663284031-b7e3aefcae8e') },
  'sc-roof-garden': { previewUrl: U('photo-1480714378408-67cf0d13bc1b') },
  'sc-riverside': { previewUrl: U('photo-1469474968028-56623f02e42e') },
  'sc-market-alley': { previewUrl: U('photo-1555939594-58d7cb561ad1') },
  'sc-library': { previewUrl: U('photo-1507842217343-583bb7270b66') },
  'sc-classroom': { previewUrl: U('photo-1580582932707-520aed937b7b') },
  'sc-backstage': { previewUrl: U('photo-1470229722913-7c0e2dbbafd3') },
  'sc-airport': { previewUrl: U('photo-1436491865332-7a61a109cc05') },
  'sc-train-window': { previewUrl: U('photo-1474487548417-781cb71495f3') },
  'sc-snow-street': { previewUrl: U('photo-1491002052546-bf38f186af56') },
  'sc-sunset-field': { previewUrl: U('photo-1500382017468-9049fed747ef') },
  'sc-pool': { previewUrl: U('photo-1576013551627-0cc20b96c2a7') },
  'sc-bathroom-mirror': { previewUrl: U('photo-1552321554-5fefe8c9ef14') },
  'sc-gallery': { previewUrl: U('photo-1536924940846-227afb31e2a5') },

  // —— Korean places ——
  'sc-hangang': { previewUrl: U('photo-1517154421773-0529f29ea451') },
  'sc-namsan': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'sc-hongdae': { previewUrl: U('photo-1542051841857-5f90071e7989') },
  'sc-gangnam': { previewUrl: U('photo-1480714378408-67cf0d13bc1b') },
  'sc-bukchon': { previewUrl: U('photo-1578662996442-48f60103fc96') },
  'sc-palace-yard': { previewUrl: U('photo-1545569341-9eb8b30979d9') },
  'sc-hanok-yard': { previewUrl: U('photo-1528164344705-47542687000d') },
  'sc-hanok-teahouse': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },
  'sc-temple-kr': { previewUrl: U('photo-1493976040374-85c8e12f0c0e') },
  'sc-euljiro': { previewUrl: U('photo-1514565131-fce0801e5785') },
  'sc-seongsu': { previewUrl: U('photo-1521017432531-fbd92d768814') },
  'sc-pojangmacha': { previewUrl: U('photo-1555939594-58d7cb561ad1') },
  'sc-bunsik': { previewUrl: U('photo-1414235077428-338989a2e8c0') },
  'sc-noraebang': { previewUrl: U('photo-1514933651103-005eec06c04b'), previewTone: 'linear-gradient(135deg,#4a044e,#7c3aed)' },
  'sc-pcbang': { previewUrl: U('photo-1542751371-adc38448a05e'), previewTone: 'linear-gradient(135deg,#0f172a,#22d3ee)' },
  'sc-jjimjilbang': { previewUrl: U('photo-1544161515-4ab6ce6db874'), previewTone: 'linear-gradient(135deg,#7c2d12,#fbbf24)' },
  'sc-oktop': { previewUrl: U('photo-1560448204-e02f11c3d0e2') },
  'sc-bus-stop-kr': { previewUrl: U('photo-1449824913935-59a10b8d2000') },
  'sc-ktx': { previewUrl: U('photo-1474487548417-781cb71495f3') },
  'sc-jeju-coast': { previewUrl: U('photo-1507525428034-b723cf961d3e') },
  'sc-haeundae': { previewUrl: U('photo-1501785888041-af3ef285b470') },
  'sc-seoul-forest': { previewUrl: U('photo-1441974231531-c6227db76b6e') },
  'sc-night-market-kr': { previewUrl: U('photo-1555396273-367ea4eb4db5') },
  'sc-university-kr': { previewUrl: U('photo-1470071459604-3b5ec3a7fe05') },





  'lens-14': { previewUrl: U('photo-1477959858617-67f85cf4f1df') },
  'lens-105': { previewUrl: U('photo-1534528741775-53994a69daeb') },
  'lens-tiltshift': { previewUrl: U('photo-1480714378408-67cf0d13bc1b') },
  'lens-macro': { previewUrl: U('photo-1515562141207-7a88fb7ce338') },
  'lens-ana-flare': { previewUrl: U('photo-1485846234645-a62644f84728') },

  'lit-silhouette': { previewUrl: U('photo-1492691527719-9d1e07e534b4') },
  'lit-window': { previewUrl: U('photo-1493663284031-b7e3aefcae8e') },
  'lit-spotlight': { previewUrl: U('photo-1470229722913-7c0e2dbbafd3') },
  'lit-fluorescent': { previewUrl: U('photo-1497366216548-37526070297c') },
  'lit-campfire': { previewUrl: U('photo-1441974231531-c6227db76b6e') },
  'lit-bluehour': { previewUrl: U('photo-1419242902214-272b3f66ee7a') },
  'lit-matte-soft': { previewUrl: U('photo-1558618666-fcd25c85cd64') },
  'lit-gel-magenta': { previewUrl: U('photo-1550684848-fac1c5b4e853') },
  'lit-gel-cyan': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'lit-lightning': { previewUrl: U('photo-1478720568477-152d9b164e26') },

  'st-vogue-edit': { previewUrl: U('photo-1509631179647-0177331693ae') },
  'st-highkey': { previewUrl: U('photo-1616394584738-fc6e612e71b9') },
  'st-lowkey': { previewUrl: U('photo-1516035069371-29a1b244cc32') },
  'st-3d-still': { previewUrl: U('photo-1618005182384-a83a8bd57fbe') },
  'st-watercolor': { previewUrl: U('photo-1490750967868-88aa4486c946') },
  'st-miniature': { previewUrl: U('photo-1480714378408-67cf0d13bc1b') },
  'st-iphone-raw': { previewUrl: U('photo-1512941937669-90a1b58e7e9c') },
  'st-magazine': { previewUrl: U('photo-1496747611176-843222e1e57c') },

  'mood-uneasy': { previewUrl: U('photo-1478720568477-152d9b164e26') },
  'mood-humor': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },
  'mood-sacred': { previewUrl: U('photo-1464822759023-fed622ff2c3b') },
  'mood-hiphop': { previewUrl: U('photo-1529139574466-a303027c1d8b') },
  'mood-asmr': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },
  'mood-thriller': { previewUrl: U('photo-1478720568477-152d9b164e26') },

  'cg-bleached': { previewUrl: U('photo-1478720568477-152d9b164e26') },
  'cg-cinestill': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'cg-kodak-warm': { previewUrl: U('photo-1495616811223-4d98c6e9c869') },
  'cg-cool-tungsten': { previewUrl: U('photo-1419242902214-272b3f66ee7a') },
  'cg-mono': { previewUrl: U('photo-1492691527719-9d1e07e534b4') },
  'cg-pastel-dream': { previewUrl: U('photo-1490750967868-88aa4486c946') },
  'cg-magenta-cyan': { previewUrl: U('photo-1550684848-fac1c5b4e853') },

  'act-nod': { previewUrl: U('photo-1531746020798-e6953c6e8e04') },
  'act-gesture': { previewUrl: U('photo-1587654780291-39c9404d746b') },
  'act-hold-rotate': { previewUrl: U('photo-1523275335684-37898b6baf30') },
  'act-look-camera': { previewUrl: U('photo-1534528741775-53994a69daeb') },
  'act-walk-rain': { previewUrl: U('photo-1515694346937-94d85e41e6f0') },
  'act-body-roll': { previewUrl: U('photo-1508700115892-45ecd05ae2ad') },
  'act-breathe': { previewUrl: U('photo-1544005313-94ddf0286df2') },
  'act-turn-walk': { previewUrl: U('photo-1519085360753-af0119f7cbe7') },

  'cam-pull-wide': { previewUrl: local('previews/camera/pull-back.svg') },
  'cam-tracking': { previewUrl: local('previews/camera/pan.svg') },
  'cam-orbit-360': { previewUrl: local('previews/camera/orbital.svg') },
  'cam-crane-down': { previewUrl: local('previews/camera/crane.svg') },
  'cam-dutch': { previewUrl: local('previews/camera/handheld.svg') },
  'cam-rack-fg': { previewUrl: local('previews/camera/rack-hint.svg') },
  'cam-drone-rise': { previewUrl: local('previews/camera/crane.svg') },

  'aud-footsteps': { previewUrl: local('previews/abstract/audio-city.svg') },
  'aud-breath-asmr': { previewUrl: local('previews/abstract/audio-ambient.svg') },
  'aud-traffic': { previewUrl: local('previews/abstract/audio-city.svg') },
  'aud-waves': { previewUrl: local('previews/abstract/audio-wind.svg') },
  'aud-vo-slot': { previewUrl: local('previews/abstract/audio-lipsync.svg') },
  'aud-beat-drop': { previewUrl: local('previews/abstract/audio-music.svg') },

  'av-fingers': { previewUrl: local('previews/abstract/av-distort.svg') },
  'av-warped-face': { previewUrl: local('previews/abstract/av-distort.svg') },
  'av-logos': { previewUrl: local('previews/abstract/av-watermark.svg') },

  'atm-sparks': { previewUrl: U('photo-1516035069371-29a1b244cc32') },
  'atm-lens-dirt': { previewUrl: U('photo-1478720568477-152d9b164e26') },
  'atm-godrays': { previewUrl: U('photo-1464822759023-fed622ff2c3b') },

  'q-shorts-ready': { previewUrl: local('previews/abstract/q-clean.svg') },
  'q-ad-polish': { previewUrl: local('previews/abstract/q-pro.svg') },


  // —— Composition / shot (photo when figurative, SVG when abstract framing) ——
  'comp-ecu': { previewUrl: U('photo-1494790108377-be9c29b29330') },
  'comp-closeup': { previewUrl: U('photo-1531746020798-e6953c6e8e04') },
  'comp-portrait': { previewUrl: U('photo-1534528741775-53994a69daeb') },
  'comp-medium-close': { previewUrl: U('photo-1529626455594-4ff0802cfb7e') },
  'comp-medium': { previewUrl: U('photo-1469334031218-e382a71b716b') },
  'comp-cowboy': { previewUrl: U('photo-1483985988355-763728e1935b') },
  'comp-full': { previewUrl: U('photo-1515886657613-9f3515b0c78f') },
  'comp-long': { previewUrl: U('photo-1469474968028-56623f02e42e') },
  'comp-wide': { previewUrl: U('photo-1477959858617-67f85cf4f1df') },
  'comp-extreme-wide': { previewUrl: U('photo-1506905925346-21bda4d32df4') },
  'comp-overhead': { previewUrl: U('photo-1414235077428-338989a2e8c0') },
  'comp-birds-eye': { previewUrl: local('previews/composition/birds-eye.svg') },
  'comp-high': { previewUrl: U('photo-1480714378408-67cf0d13bc1b') },
  'comp-low': { previewUrl: U('photo-1492144534655-ae79c964c9d7') },
  'comp-worms-eye': { previewUrl: local('previews/composition/worms-eye.svg') },
  'comp-dutch': { previewUrl: local('previews/composition/dutch.svg') },
  'comp-rule3': { previewUrl: local('previews/composition/rule3.svg') },
  'comp-centered': { previewUrl: local('previews/composition/centered.svg') },
  'comp-golden': { previewUrl: local('previews/composition/golden.svg') },
  'comp-leading': { previewUrl: local('previews/composition/leading.svg') },
  'comp-diagonal': { previewUrl: local('previews/composition/diagonal.svg') },
  'comp-symmetry': { previewUrl: local('previews/composition/symmetry.svg') },
  'comp-profile': { previewUrl: U('photo-1500648767791-00dcc994a43e') },
  'comp-3quarter': { previewUrl: U('photo-1488426862026-3ee34a7d66df') },
  'comp-back': { previewUrl: U('photo-1524504388940-b1c1722653e1') },
  'comp-silhouette': { previewUrl: U('photo-1495616811223-4d98c6e9c869') },
  'comp-overshoulder': { previewUrl: local('previews/composition/overshoulder.svg') },
  'comp-two-shot': { previewUrl: U('photo-1516589178581-6cd7833ae3b2') },
  'comp-group': { previewUrl: U('photo-1529156069898-49953e39b3ac') },
  'comp-insert': { previewUrl: U('photo-1523275335684-37898b6baf30') },
  'comp-cutaway': { previewUrl: U('photo-1495474472287-4d71bcdd2085') },
  'comp-pov': { previewUrl: local('previews/composition/pov.svg') },
  'comp-selfie': { previewUrl: U('photo-1517841905240-472988babdf9') },
  'comp-reflection': { previewUrl: U('photo-1515694346937-94d85e41e6f0') },
  'comp-frame-in-frame': { previewUrl: local('previews/composition/frame-in-frame.svg') },
  'comp-neg-space': { previewUrl: local('previews/composition/neg-space.svg') },
  'comp-crowded': { previewUrl: U('photo-1519501025264-65ba15a82390') },
  'comp-macro': { previewUrl: U('photo-1490750967868-88aa4486c946') },
  'comp-flatlay': { previewUrl: U('photo-1515562141207-7a88fb7ce338') },
  'comp-split': { previewUrl: local('previews/composition/split.svg') },
  'comp-foreground': { previewUrl: U('photo-1441974231531-c6227db76b6e') },
  'comp-through': { previewUrl: U('photo-1470071459604-3b5ec3a7fe05') },
  'comp-tracking-frame': { previewUrl: U('photo-1476480862126-209bfaa8edc8') },

  'comp-vertical': { previewUrl: local('previews/composition/vertical.svg') },
  'comp-horizontal': { previewUrl: local('previews/composition/horizontal.svg') },
  'comp-square': { previewUrl: local('previews/composition/square.svg') },

};

/** Preset cover images */
export const PRESET_COVERS: Record<string, string> = {
  'preset-fashion': U('photo-1509631179647-0177331693ae'),
  'preset-product': U('photo-1523275335684-37898b6baf30'),
  'preset-cinematic': U('photo-1495616811223-4d98c6e9c869'),
  'preset-food': U('photo-1546069901-ba9599a7e63c'),
  'preset-night': U('photo-1519501025264-65ba15a82390'),
  'preset-car': U('photo-1492144534655-ae79c964c9d7'),
  'preset-character': U('photo-1534528741775-53994a69daeb'),
  'preset-beauty': U('photo-1616394584738-fc6e612e71b9'),
  'preset-shorts-hook': U('photo-1512941937669-90a1b58e7e9c'),
  'preset-rainy-city': U('photo-1428592933017-aad5006962bc'),
  'preset-vlog-cafe': U('photo-1495474472287-4d71bcdd2085'),
  'preset-unbox': U('photo-1587654780291-39c9404d746b'),
  'preset-mv-silhouette': U('photo-1492691527719-9d1e07e534b4'),
  'preset-shorts-product': U('photo-1511707171634-5f897ff02aa9'),
  'preset-beauty-ad': U('photo-1596462502278-27bfdc403348'),
  'preset-mv-neon': U('photo-1519501025264-65ba15a82390'),
  'preset-commerce-jewelry': U('photo-1515562141207-7a88fb7ce338'),
  'preset-reel-vlog': U('photo-1495474472287-4d71bcdd2085'),
  'preset-cinematic-drone': U('photo-1500382017468-9049fed747ef'),

};

export function resolvePreview(
  chipId: string,
  categoryId?: string,
  chipPreviewUrl?: string,
  chipPreviewTone?: string,
): PreviewMeta {
  const mapped = PREVIEW_BY_ID[chipId];
  const tone =
    chipPreviewTone ||
    mapped?.previewTone ||
    (categoryId ? CATEGORY_TONES[categoryId] : undefined) ||
    CATEGORY_TONES.subject;
  return {
    previewUrl: chipPreviewUrl || mapped?.previewUrl,
    previewTone: tone,
  };
}
