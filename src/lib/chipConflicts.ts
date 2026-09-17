/**
 * Cross-chip conflict groups: at most one chip from each group may be selected.
 * Exclusive categories are already handled in toggleChip; these cover multi-select
 * categories (esp. composition) and cross-category contradictions.
 */

/** Mutually exclusive groups */
export const CONFLICT_GROUPS: readonly (readonly string[])[] = [
  // Shot scale / crop
  [
    'comp-ecu',
    'comp-closeup',
    'comp-medium-close',
    'comp-portrait',
    'comp-medium',
    'comp-cowboy',
    'comp-full',
    'comp-long',
    'comp-wide',
    'comp-extreme-wide',
    'comp-macro',
    'comp-hands-only',
  ],
  // Camera angle
  [
    'comp-overhead',
    'comp-birds-eye',
    'comp-high',
    'comp-low',
    'comp-worms-eye',
    'comp-dutch',
  ],
  // Framing rule
  ['comp-rule3', 'comp-centered', 'comp-golden', 'comp-symmetry'],
  // View / direction
  [
    'comp-back',
    'comp-profile',
    'comp-3quarter',
    'comp-selfie',
    'comp-pov',
    'comp-chest-cam-pov',
    'comp-overshoulder',
  ],
  // Aspect
  ['comp-vertical', 'comp-horizontal', 'comp-square'],
  // Hands-only vs face-forward subjects (topic)
  [
    'sub-hands',
    'sub-woman',
    'sub-man',
    'sub-couple',
    'sub-child',
    'sub-senior',
    'sub-group',
    'sub-fashion',
  ],
  // Hands-only poses vs face/body standing poses that imply a visible face
  [
    'pose-hands-only',
    'pose-hands-chest-cam',
    'pose-stand-look-back',
    'pose-stand-hands-face',
    'pose-stand-phone',
    'pose-stand-coffee',
    'pose-stand-mirror',
  ],
];

/** Extra pairwise blocks (either side blocks the other) */
export const CONFLICT_PAIRS: readonly (readonly [string, string])[] = [
  // Hands-only framing vs face-centric comps
  ['comp-hands-only', 'comp-selfie'],
  ['comp-hands-only', 'comp-portrait'],
  ['pose-hands-only', 'comp-selfie'],
  ['pose-hands-chest-cam', 'comp-selfie'],
  ['pose-stand-back-cam', 'comp-selfie'],
  ['pose-stand-back-cam', 'act-look-camera'],
  ['comp-back', 'act-look-camera'],
  ['comp-chest-cam-pov', 'comp-selfie'],
  ['comp-chest-cam-pov', 'pose-stand-look-back'],
];

function buildConflictMap(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  const add = (a: string, b: string) => {
    if (a === b) return;
    if (!map.has(a)) map.set(a, new Set());
    if (!map.has(b)) map.set(b, new Set());
    map.get(a)!.add(b);
    map.get(b)!.add(a);
  };
  for (const group of CONFLICT_GROUPS) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        add(group[i], group[j]);
      }
    }
  }
  for (const [a, b] of CONFLICT_PAIRS) add(a, b);
  return map;
}

const CONFLICT_MAP = buildConflictMap();

/** All chip ids that conflict with any currently selected chip (not including selected). */
export function getBlockedChipIds(selectedIds: readonly string[]): Set<string> {
  const blocked = new Set<string>();
  const selected = new Set(selectedIds);
  for (const id of selectedIds) {
    const foes = CONFLICT_MAP.get(id);
    if (!foes) continue;
    for (const f of foes) {
      if (!selected.has(f)) blocked.add(f);
    }
  }
  return blocked;
}

export function chipConflictsWithSelected(
  chipId: string,
  selectedIds: readonly string[],
): string | null {
  const foes = CONFLICT_MAP.get(chipId);
  if (!foes) return null;
  for (const id of selectedIds) {
    if (foes.has(id)) return id;
  }
  return null;
}

/** Labels of selected chips that block this chip (for tooltip). */
export function blockingSelectedLabels(
  chipId: string,
  selectedIds: readonly string[],
  labelOf: (id: string) => string,
): string[] {
  const foes = CONFLICT_MAP.get(chipId);
  if (!foes) return [];
  const out: string[] = [];
  for (const id of selectedIds) {
    if (foes.has(id)) out.push(labelOf(id));
  }
  return out;
}
