import {
  CATEGORIES,
  type Mode,
  chipById,
  categoryByChipId,
} from '../data/chips';

/** Lightweight Korean → English helpers for common creative intent words */
const KO_TO_EN: Array<[RegExp, string]> = [
  [/시네마틱/g, 'cinematic'],
  [/포트레이트|초상/g, 'portrait'],
  [/패션/g, 'fashion'],
  [/룩북/g, 'lookbook'],
  [/제품/g, 'product'],
  [/야경/g, 'night cityscape'],
  [/도시/g, 'city'],
  [/카페/g, 'cafe'],
  [/먹방|음식/g, 'food'],
  [/자동차|차량/g, 'car'],
  [/스튜디오/g, 'studio'],
  [/골든\s*아워|골든아워/g, 'golden hour'],
  [/네온/g, 'neon'],
  [/우아한|우아함/g, 'elegant'],
  [/드라마틱/g, 'dramatic'],
  [/미니멀/g, 'minimal'],
  [/고급|럭셔리|하이엔드/g, 'luxury'],
  [/따뜻한/g, 'warm'],
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
  [/비오는|비\s/g, 'rainy'],
  [/눈\s|눈오는/g, 'snowy'],
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
  [/쇼츠/g, 'short clip'],
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
  'composition',
  'lens',
  'lighting',
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

/** Image / character: full appearance + environment prompt */
export function buildImagePrompt(input: BuildInput): string {
  const idea = translateIdeaToEnglish(input.ideaKo);
  const subjectParts = valuesForCategories(input.selectedIds, [
    'subject',
    'personDetail',
  ]);
  const envParts = valuesForCategories(input.selectedIds, [
    'scene',
    'composition',
  ]);
  const styleParts = valuesForCategories(input.selectedIds, [
    'style',
    'lighting',
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
 * Video motion prompt: focus on action, camera, timing, mood.
 * Avoid heavy appearance re-description (Higgsfield I2V guidance).
 */
export function buildVideoPrompt(input: BuildInput): string {
  const idea = translateIdeaToEnglish(input.ideaKo);
  const motionParts = valuesForCategories(
    input.selectedIds,
    VIDEO_MOTION_ORDER,
  );

  const sentences: string[] = [];

  // Light subject cue only if present — keep short
  const subjectOnly = valuesForCategories(input.selectedIds, ['subject']);
  if (subjectOnly.length && input.mode === 'video') {
    // Soft anchor without re-describing look
    sentences.push(`Animate the existing image.`);
  } else if (input.mode === 'video') {
    sentences.push(`Animate the existing image.`);
  }

  if (idea) {
    // Prefer action-oriented idea phrasing
    sentences.push(idea.endsWith('.') ? idea : `${idea}.`);
  }

  const actions = valuesForCategories(input.selectedIds, ['action']);
  if (actions.length) {
    sentences.push(`Action: ${actions.join('; ')}.`);
  }

  const cam = valuesForCategories(input.selectedIds, ['cameraMove']);
  if (cam.length) {
    sentences.push(`Camera: ${cam.join(', ')}.`);
  }

  const timing = valuesForCategories(input.selectedIds, ['timing', 'pacing']);
  if (timing.length) {
    sentences.push(`Timing: ${timing.join(', ')}.`);
  }

  const mood = valuesForCategories(input.selectedIds, ['mood']);
  if (mood.length) {
    sentences.push(`Mood: ${mood.join(', ')}.`);
  }

  const audio = valuesForCategories(input.selectedIds, ['audio']);
  if (audio.length) {
    sentences.push(`Audio hint: ${audio.join(', ')}.`);
  }

  // If somehow no motion chips, still include any leftover motionParts
  if (
    !actions.length &&
    !cam.length &&
    !timing.length &&
    motionParts.length === 0 &&
    !idea
  ) {
    sentences.push('Subtle natural motion, locked framing.');
  }

  const custom = input.customEn.trim();
  if (custom) {
    sentences.push(custom.endsWith('.') ? custom : `${custom}.`);
  }

  // Short avoid for video too
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

export { IMAGE_ORDER, VIDEO_MOTION_ORDER, chipById };
