import {
  CATEGORIES,
  type Mode,
  chipById,
  categoryByChipId,
  APPEARANCE_HEAVY_CATEGORY_IDS,
} from '../data/chips';

/** Lightweight Korean → English helpers for common creative intent words */
const KO_TO_EN: Array<[RegExp, string]> = [
  [/시네마틱/g, 'cinematic'],
  [/포트레이트|초상/g, 'portrait'],
  [/패션/g, 'fashion'],
  [/룩북/g, 'lookbook'],
  [/제품컷|제품\s*컷/g, 'product shot'],
  [/제품/g, 'product'],
  [/언박싱/g, 'unboxing'],
  [/야경/g, 'night cityscape'],
  [/도시/g, 'city'],
  [/카페/g, 'cafe'],
  [/먹방|음식/g, 'food'],
  [/자동차|차량/g, 'car'],
  [/스튜디오/g, 'studio'],
  [/골든\s*아워|골든아워/g, 'golden hour'],
  [/블루\s*아워|블루아워/g, 'blue hour'],
  [/네온/g, 'neon'],
  [/우아한|우아함/g, 'elegant'],
  [/고급스러운|고급|럭셔리|하이엔드/g, 'luxury'],
  [/드라마틱/g, 'dramatic'],
  [/미니멀/g, 'minimal'],
  [/따뜻한/g, 'warm'],
  [/차가운|쿨한/g, 'cool'],
  [/힙한|힙한/g, 'hip'],
  [/감성/g, 'emotional aesthetic'],
  [/몽환/g, 'dreamy ethereal'],
  [/긴장감/g, 'tense suspense'],
  [/천천히|느리게/g, 'slowly'],
  [/드러나는|공개/g, 'revealed'],
  [/클로즈업/g, 'close-up'],
  [/와이드/g, 'wide shot'],
  [/인물/g, 'person'],
  [/여성/g, 'woman'],
  [/남성/g, 'man'],
  [/배경/g, 'background'],
  [/조명/g, 'lighting'],
  [/분위기/g, 'mood'],
  [/자연광/g, 'natural light'],
  [/루프탑/g, 'rooftop'],
  [/해변/g, 'beach'],
  [/숲/g, 'forest'],
  [/비오는|비\s*오는|비\s/g, 'rainy'],
  [/눈\s|눈오는|눈\s*오는/g, 'snowy'],
  [/일몰|석양/g, 'sunset'],
  [/일출/g, 'sunrise'],
  [/밤|야간/g, 'night'],
  [/낮|주간/g, 'daytime'],
  [/걷는|걷기/g, 'walking'],
  [/미소|웃는/g, 'smiling'],
  [/바라보는|시선/g, 'looking'],
  [/감싸는|감싸/g, 'wrapping around'],
  [/낮은\s*앵글/g, 'low angle'],
  [/아크\s*무브/g, 'arc move'],
  [/김이\s*오르는/g, 'with rising steam'],
  [/일관된\s*캐릭터용?/g, 'consistent character'],
  [/베이스/g, 'base'],
  [/표지\s*느낌의?/g, 'cover-style'],
  [/유튜브\s*쇼츠|쇼츠/g, 'shorts'],
  [/유튜브/g, 'YouTube'],
  [/하이라이트/g, 'highlight'],
  [/역광/g, 'backlight'],
  [/실루엣/g, 'silhouette'],
  [/보케/g, 'bokeh'],
  [/핸드헬드/g, 'handheld'],
  [/달리|돌리/g, 'dolly'],
  [/크레인/g, 'crane'],
  [/오빗|오비탈/g, 'orbit'],
  [/스테디캠/g, 'steadicam'],
  [/랙\s*포커스|랙포커스/g, 'rack focus'],
  [/리뷰/g, 'review'],
  [/브이로그/g, 'vlog'],
  [/뷰티/g, 'beauty'],
  [/뮤직\s*비디오|뮤직비디오|MV/g, 'music video'],
  [/훅/g, 'hook'],
  [/피부/g, 'skin'],
  [/디테일/g, 'detail'],
  [/하이키/g, 'high-key'],
  [/로우키/g, 'low-key'],
  [/필믹|필름릭/g, 'filmic'],
  [/파스텔/g, 'pastel'],
  [/사이버펑크/g, 'cyberpunk'],
  [/한옥/g, 'hanok'],
  [/벚꽃/g, 'cherry blossom'],
  [/지하철/g, 'subway'],
  [/서점/g, 'bookstore'],
  [/헬스장|짐/g, 'gym'],
  [/로비/g, 'lobby'],
  [/사막/g, 'desert'],
  [/안개/g, 'fog'],
  [/스팀|김/g, 'steam'],
  [/커피/g, 'coffee'],
  [/폰|스마트폰/g, 'phone'],
  [/손|핸드/g, 'hands'],
  [/컷/g, 'shot'],
  [/느낌의?/g, 'feeling'],
  [/의/g, ''],
  [/에서/g, ' in '],
  [/을|를|이|가|은|는/g, ' '],
];

export function translateIdeaToEnglish(ko: string): string {
  const trimmed = ko.trim();
  if (!trimmed) return '';
  // If mostly ASCII / already English, keep as-is
  const koreanChars = (trimmed.match(/[\uac00-\ud7a3]/g) || []).length;
  if (koreanChars === 0) return trimmed;

  let result = trimmed;
  for (const [re, en] of KO_TO_EN) {
    result = result.replace(re, en);
  }
  // Strip leftover Hangul syllables (untranslated) to avoid mixing
  result = result.replace(/[\uac00-\ud7a3]+/g, ' ');
  result = result.replace(/[^\x00-\x7F]/g, ' ');
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

const IMAGE_ORDER = [
  'subject',
  'personDetail',
  'scene',
  'atmosphere',
  'composition',
  'lens',
  'lighting',
  'colorGrade',
  'style',
  'mood',
  'quality',
] as const;

const VIDEO_MOTION_ORDER = [
  'action',
  'cameraMove',
  'timing',
  'pacing',
  'mood',
  'audio',
] as const;

/** Layer labels shown above preview (주제 / 환경 / …) */
export const LAYER_LABELS: Record<string, string> = {
  subject: '주제',
  personDetail: '인물',
  scene: '환경',
  atmosphere: '대기',
  composition: '구도',
  lens: '렌즈',
  lighting: '조명',
  colorGrade: '컬러',
  style: '스타일',
  mood: '분위기',
  quality: '품질',
  avoid: '피하기',
  action: '동작',
  cameraMove: '카메라',
  timing: '길이',
  pacing: '속도',
  audio: '오디오',
};

export interface BuildInput {
  mode: Mode;
  selectedIds: string[];
  ideaKo: string;
  customEn: string;
}

export interface BuildResult {
  imagePrompt: string;
  videoPrompt: string;
  /** Primary prompt for the active mode */
  primary: string;
}

function valuesForCategories(
  selectedIds: string[],
  categoryIds: readonly string[],
): string[] {
  const parts: string[] = [];
  for (const catId of categoryIds) {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) continue;
    const selected = cat.chips.filter((c) => selectedIds.includes(c.id));
    for (const chip of selected) {
      parts.push(chip.valueEn);
    }
  }
  return parts;
}

function avoidClause(selectedIds: string[]): string {
  const avoidCat = CATEGORIES.find((c) => c.id === 'avoid');
  if (!avoidCat) return '';
  const items = avoidCat.chips
    .filter((c) => selectedIds.includes(c.id))
    .map((c) => c.valueEn);
  if (items.length === 0) return '';
  return `Avoid: ${items.join(', ')}.`;
}

function joinSentences(parts: string[]): string {
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .trim();
}

/** Join labeled blocks with newlines for Higgsfield-style video prompts */
function joinBlocks(blocks: string[]): string {
  return blocks
    .map((b) => b.trim())
    .filter(Boolean)
    .join('\n');
}

/** Image / character: full appearance + environment prompt (flowing sentences) */
export function buildImagePrompt(input: BuildInput): string {
  const idea = translateIdeaToEnglish(input.ideaKo);
  const subjectParts = valuesForCategories(input.selectedIds, [
    'subject',
    'personDetail',
  ]);
  const envParts = valuesForCategories(input.selectedIds, [
    'scene',
    'atmosphere',
    'composition',
  ]);
  const styleParts = valuesForCategories(input.selectedIds, [
    'style',
    'lighting',
    'colorGrade',
    'lens',
    'mood',
  ]);
  const qualityParts = valuesForCategories(input.selectedIds, ['quality']);

  const sentences: string[] = [];

  if (idea) {
    sentences.push(idea.endsWith('.') ? idea : `${idea}.`);
  }

  if (subjectParts.length) {
    sentences.push(`${subjectParts.join(', ')}.`);
  }
  if (envParts.length) {
    sentences.push(`Setting and framing: ${envParts.join(', ')}.`);
  }
  if (styleParts.length) {
    sentences.push(`${styleParts.join(', ')}.`);
  }
  if (qualityParts.length) {
    sentences.push(`${qualityParts.join(', ')}.`);
  }

  const custom = input.customEn.trim();
  if (custom) {
    sentences.push(custom.endsWith('.') ? custom : `${custom}.`);
  }

  const avoid = avoidClause(input.selectedIds);
  if (avoid) sentences.push(avoid);

  return joinSentences(sentences);
}

/**
 * Video motion prompt: labeled blocks when motion chips present.
 * Avoid heavy appearance re-description (Higgsfield I2V guidance).
 */
export function buildVideoPrompt(input: BuildInput): string {
  const idea = translateIdeaToEnglish(input.ideaKo);
  const actions = valuesForCategories(input.selectedIds, ['action']);
  const cam = valuesForCategories(input.selectedIds, ['cameraMove']);
  const timing = valuesForCategories(input.selectedIds, ['timing', 'pacing']);
  const mood = valuesForCategories(input.selectedIds, ['mood']);
  const audio = valuesForCategories(input.selectedIds, ['audio']);

  const motionChipCount =
    actions.length + cam.length + timing.length + audio.length;
  const useBlocks = motionChipCount >= 2;

  if (useBlocks) {
    const blocks: string[] = [];
    blocks.push('Animate the existing image.');
    if (idea) {
      blocks.push(idea.endsWith('.') ? idea : `${idea}.`);
    }
    if (actions.length) {
      blocks.push(`Action: ${actions.join('; ')}`);
    }
    if (cam.length) {
      blocks.push(`Camera: ${cam.join(', ')}`);
    }
    if (timing.length) {
      blocks.push(`Timing: ${timing.join(', ')}`);
    }
    if (mood.length) {
      blocks.push(`Mood: ${mood.join(', ')}`);
    }
    if (audio.length) {
      blocks.push(`Audio: ${audio.join(', ')}`);
    }
    const custom = input.customEn.trim();
    if (custom) {
      blocks.push(custom.endsWith('.') ? custom : `${custom}.`);
    }
    const avoid = avoidClause(input.selectedIds);
    if (avoid) blocks.push(avoid);
    return joinBlocks(blocks);
  }

  // Fallback: flowing sentences when few motion chips
  const sentences: string[] = [];
  sentences.push('Animate the existing image.');

  if (idea) {
    sentences.push(idea.endsWith('.') ? idea : `${idea}.`);
  }
  if (actions.length) {
    sentences.push(`Action: ${actions.join('; ')}.`);
  }
  if (cam.length) {
    sentences.push(`Camera: ${cam.join(', ')}.`);
  }
  if (timing.length) {
    sentences.push(`Timing: ${timing.join(', ')}.`);
  }
  if (mood.length) {
    sentences.push(`Mood: ${mood.join(', ')}.`);
  }
  if (audio.length) {
    sentences.push(`Audio: ${audio.join(', ')}.`);
  }
  if (
    !actions.length &&
    !cam.length &&
    !timing.length &&
    !idea
  ) {
    sentences.push('Subtle natural motion, locked framing.');
  }

  const custom = input.customEn.trim();
  if (custom) {
    sentences.push(custom.endsWith('.') ? custom : `${custom}.`);
  }
  const avoid = avoidClause(input.selectedIds);
  if (avoid) sentences.push(avoid);

  return joinSentences(sentences);
}

export function buildPrompt(input: BuildInput): BuildResult {
  const imagePrompt = buildImagePrompt(input);
  const videoPrompt = buildVideoPrompt(input);

  let primary: string;
  if (input.mode === 'video') {
    primary = videoPrompt;
  } else {
    primary = imagePrompt;
  }

  return { imagePrompt, videoPrompt, primary };
}

/** Toggle helper respecting exclusive categories */
export function toggleChip(
  selectedIds: string[],
  chipId: string,
): string[] {
  const cat = categoryByChipId(chipId);
  if (!cat) return selectedIds;

  const isSelected = selectedIds.includes(chipId);
  if (isSelected) {
    return selectedIds.filter((id) => id !== chipId);
  }

  if (cat.exclusive) {
    const siblingIds = new Set(cat.chips.map((c) => c.id));
    const withoutSiblings = selectedIds.filter((id) => !siblingIds.has(id));
    return [...withoutSiblings, chipId];
  }

  return [...selectedIds, chipId];
}

export function categoriesForMode(mode: Mode) {
  return CATEGORIES.filter((c) => c.modes.includes(mode));
}

/**
 * Switch image/character → video: keep idea/custom + shared chips,
 * drop appearance-heavy exclusive conflicts (personDetail, quality).
 */
export function switchToVideoKeepingShared(selectedIds: string[]): string[] {
  return selectedIds.filter((id) => {
    const cat = categoryByChipId(id);
    if (!cat) return false;
    if (!cat.modes.includes('video')) return false;
    if (APPEARANCE_HEAVY_CATEGORY_IDS.has(cat.id)) return false;
    return true;
  });
}

/** Active layer tags for selected chips (ordered) */
export function activeLayerTags(
  selectedIds: string[],
  mode: Mode,
): string[] {
  const order =
    mode === 'video'
      ? [
          ...IMAGE_ORDER.filter((id) =>
            CATEGORIES.find((c) => c.id === id)?.modes.includes('video'),
          ),
          ...VIDEO_MOTION_ORDER,
          'avoid',
        ]
      : [...IMAGE_ORDER, 'avoid'];

  const tags: string[] = [];
  for (const catId of order) {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) continue;
    const has = cat.chips.some((c) => selectedIds.includes(c.id));
    if (has) {
      tags.push(LAYER_LABELS[catId] ?? cat.labelKo);
    }
  }
  return tags;
}

export { IMAGE_ORDER, VIDEO_MOTION_ORDER, chipById };
