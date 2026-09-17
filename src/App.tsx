import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type FocusEvent,
} from 'react';

/** Desktop hover only — skip sticky tooltips on touch / coarse pointers */
function canFinePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

function clampTipPos(x: number, y: number): { x: number; y: number; below: boolean } {
  const tipW = 170;
  const tipH = 150;
  const pad = 8;
  const cx = Math.min(Math.max(x, tipW / 2 + pad), window.innerWidth - tipW / 2 - pad);
  const below = y < tipH + pad;
  const cy = below
    ? Math.min(y + 12, window.innerHeight - tipH - pad)
    : Math.max(y, tipH + pad);
  return { x: cx, y: cy, below };
}
import {
  CATEGORIES,
  PRESETS,
  chipById,
  categoryByChipId,
  type Mode,
  type Preset,
  type Chip,
  type ChipCategory,
} from './data/chips';
import {
  PRESET_COVERS,
  resolvePreview,
} from './data/previews';
import {
  buildPrompt,
  categoriesForMode,
  toggleChip,
  translateIdeaToEnglish,
  switchToVideoKeepingShared,
  activeLayerTags,
} from './lib/buildPrompt';
import {
  getBlockedChipIds,
  blockingSelectedLabels,
} from './lib/chipConflicts';
import './App.css';

const MODE_TABS: { id: Mode; label: string; hint: string }[] = [
  { id: 'image', label: '이미지', hint: '사진 · 키프레임' },
  { id: 'video', label: '영상', hint: 'Seedance / Kling / DoP I2V' },
  { id: 'character', label: '캐릭터', hint: '캐릭터 기본 컷' },
];

const FAV_KEY = 'hfpb-favorites-v1';
const HIST_KEY = 'hfpb-history-v1';
const MAX_HISTORY = 10;

interface StoredPrompt {
  id: string;
  text: string;
  mode: Mode;
  label?: string;
  createdAt: number;
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function App() {
  const [mode, setMode] = useState<Mode>('image');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ideaKo, setIdeaKo] = useState('');
  const [customEn, setCustomEn] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [chipQuery, setChipQuery] = useState('');
  const [favorites, setFavorites] = useState<StoredPrompt[]>(() =>
    loadJson(FAV_KEY, []),
  );
  const [history, setHistory] = useState<StoredPrompt[]>(() =>
    loadJson(HIST_KEY, []),
  );
  const [showFavPanel, setShowFavPanel] = useState(false);
  const [showHistPanel, setShowHistPanel] = useState(false);
  const [hoverPreview, setHoverPreview] = useState<{
    chip: Chip;
    cat: ChipCategory;
    x: number;
    y: number;
    below?: boolean;
  } | null>(null);
  const [presetHover, setPresetHover] = useState<{
    id: string;
    label: string;
    x: number;
    y: number;
    below?: boolean;
  } | null>(null);
  /** Mobile selection preview strip expand (default collapsed → one compact row) */
  const [previewOpen, setPreviewOpen] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  const clearTips = useCallback(() => {
    setHoverPreview(null);
    setPresetHover(null);
  }, []);

  const visibleCategories = useMemo(
    () => categoriesForMode(mode),
    [mode],
  );

  const visiblePresets = useMemo(
    () => PRESETS.filter((p) => p.mode === mode),
    [mode],
  );

  const result = useMemo(
    () => buildPrompt({ mode, selectedIds, ideaKo, customEn }),
    [mode, selectedIds, ideaKo, customEn],
  );

  const ideaPreview = useMemo(
    () => translateIdeaToEnglish(ideaKo),
    [ideaKo],
  );

  const layerTags = useMemo(
    () => activeLayerTags(selectedIds, mode),
    [selectedIds, mode],
  );

  const selectedChips = useMemo(() => {
    return selectedIds
      .map((id) => {
        const chip = chipById(id);
        const cat = categoryByChipId(id);
        if (!chip || !cat) return null;
        return { chip, cat };
      })
      .filter(Boolean) as { chip: Chip; cat: ChipCategory }[];
  }, [selectedIds]);

  const lastSelectedChip = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const lastId = selectedIds[selectedIds.length - 1];
    return selectedChips.find((x) => x.chip.id === lastId) ?? selectedChips[selectedChips.length - 1] ?? null;
  }, [selectedIds, selectedChips]);

  const filteredCategories = useMemo(() => {
    const q = chipQuery.trim().toLowerCase();
    if (!q) return visibleCategories;
    return visibleCategories
      .map((cat) => ({
        ...cat,
        chips: cat.chips.filter(
          (c) =>
            c.labelKo.toLowerCase().includes(q) ||
            c.valueEn.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.chips.length > 0);
  }, [visibleCategories, chipQuery]);

  const requiredCategories = useMemo(
    () =>
      visibleCategories.filter(
        (c) => c.required?.includes(mode) && c.chips.length > 0,
      ),
    [visibleCategories, mode],
  );

  const missingRequired = useMemo(() => {
    const selected = new Set(selectedIds);
    return requiredCategories.filter(
      (c) => !c.chips.some((chip) => selected.has(chip.id)),
    );
  }, [requiredCategories, selectedIds]);

  const selectedByCategory = useMemo(() => {
    const map = new Set<string>();
    for (const id of selectedIds) {
      const cat = categoryByChipId(id);
      if (cat) map.add(cat.id);
    }
    return map;
  }, [selectedIds]);

  const blockedChipIds = useMemo(
    () => getBlockedChipIds(selectedIds),
    [selectedIds],
  );

  const canCopyPrompt = missingRequired.length === 0;


  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(HIST_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const text = result.primary.trim();
    if (!text) return;
    const t = window.setTimeout(() => {
      setHistory((prev) => {
        if (prev[0]?.text === text && prev[0]?.mode === mode) return prev;
        const entry: StoredPrompt = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text,
          mode,
          createdAt: Date.now(),
        };
        return [entry, ...prev.filter((h) => h.text !== text)].slice(
          0,
          MAX_HISTORY,
        );
      });
    }, 1200);
    return () => window.clearTimeout(t);
  }, [result.primary, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const clear = () => clearTips();
    window.addEventListener('scroll', clear, { passive: true, capture: true });
    document.addEventListener('touchstart', clear, { passive: true });
    return () => {
      window.removeEventListener('scroll', clear, true);
      document.removeEventListener('touchstart', clear);
    };
  }, [clearTips]);

  const onToggle = (chipId: string) => {
    setSelectedIds((prev) => {
      const next = toggleChip(prev, chipId);
      // Mobile: open right vertical preview when first chip is selected
      if (
        prev.length === 0 &&
        next.length > 0 &&
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 960px)').matches
      ) {
        setPreviewOpen(true);
      }
      return next;
    });
    setActivePreset(null);
    clearTips();
  };

  const onReset = () => {
    setSelectedIds([]);
    setIdeaKo('');
    setCustomEn('');
    setActivePreset(null);
    setChipQuery('');
    showToast('초기화했어');
  };

  const clearSelection = () => {
    if (selectedIds.length === 0) {
      showToast('지울 게 없어');
      return;
    }
    setSelectedIds([]);
    setActivePreset(null);
    showToast('선택 지웠어');
  };

  const exportSelection = () => {
    if (selectedChips.length === 0 && !result.primary.trim()) {
      showToast('내보낼 게 없어');
      return;
    }
    const chipLines = selectedChips
      .map(({ chip, cat }) => `- [${cat.labelKo}] ${chip.labelKo} / ${chip.valueEn}`)
      .join('\n');
    const body = [
      `# Higgsfield Prompt Export`,
      `mode: ${mode}`,
      `idea: ${ideaKo.trim() || '(none)'}`,
      '',
      '## Selected chips',
      chipLines || '(none)',
      '',
      '## Image prompt',
      result.imagePrompt || '(empty)',
      '',
      '## Video prompt',
      result.videoPrompt || '(empty)',
      '',
      '## Primary',
      result.primary || '(empty)',
    ].join('\n');
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.href = url;
    a.download = `higgsfield-prompt-${stamp}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    void navigator.clipboard?.writeText(result.primary || body).catch(() => {});
    showToast('파일로 내보내고 복사했어');
  };

  const applyPreset = (preset: Preset) => {
    setMode(preset.mode);
    setSelectedIds([...preset.chipIds]);
    setIdeaKo(preset.ideaKo ?? '');
    setCustomEn(preset.customEn ?? '');
    setActivePreset(preset.id);
    clearTips();
    showToast(`프리셋 적용: ${preset.labelKo}`);
  };

  const pushHistory = (text: string, m: Mode) => {
    if (!text.trim()) return;
    setHistory((prev) => {
      const entry: StoredPrompt = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        mode: m,
        createdAt: Date.now(),
      };
      return [entry, ...prev.filter((h) => h.text !== text)].slice(
        0,
        MAX_HISTORY,
      );
    });
  };

  const copyText = async (text: string, label: string) => {
    if (!canCopyPrompt) {
      showToast(
        `필수 먼저 골라줘: ${missingRequired.map((c) => c.labelKo).join(', ')}`,
      );
      return;
    }
    if (!text.trim()) {
      showToast('복사할 문구가 비어 있어');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} 복사됨`);
      pushHistory(text, mode);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`${label} 복사됨`);
      pushHistory(text, mode);
    }
  };

  const starFavorite = () => {
    const text = result.primary.trim();
    if (!text) {
      showToast('저장할 문구가 비어 있어');
      return;
    }
    setFavorites((prev) => {
      if (prev.some((f) => f.text === text)) {
        showToast('이미 즐겨찾기에 있어');
        return prev;
      }
      const entry: StoredPrompt = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        mode,
        label: ideaKo.trim() || undefined,
        createdAt: Date.now(),
      };
      showToast('즐겨찾기에 넣었어');
      return [entry, ...prev];
    });
  };

  const deleteFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    showToast('즐겨찾기에서 지웠어');
  };

  const loadStored = (item: StoredPrompt) => {
    setMode(item.mode);
    setCustomEn(item.text);
    setIdeaKo('');
    setSelectedIds([]);
    setActivePreset(null);
    showToast('저장해 둔 문구 불러왔어');
  };

  const switchKeyframeToVideo = () => {
    setMode('video');
    setSelectedIds((prev) => switchToVideoKeepingShared(prev));
    setActivePreset(null);
    clearTips();
    showToast('영상으로 바꿨어. 외형 칩은 정리했고 공통 칩은 남겼어');
  };

  const showChipTip = (
    e: MouseEvent | FocusEvent,
    chip: Chip,
    cat: ChipCategory,
  ) => {
    if (!canFinePointer()) return;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const pos = clampTipPos(r.left + r.width / 2, r.top);
    setHoverPreview({
      chip,
      cat,
      x: pos.x,
      y: pos.y,
      below: pos.below,
    });
  };

  const showPresetTip = (
    e: MouseEvent | FocusEvent,
    id: string,
    label: string,
  ) => {
    if (!canFinePointer()) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = clampTipPos(r.left + r.width / 2, r.top);
    setPresetHover({
      id,
      label,
      x: pos.x,
      y: pos.y,
      below: pos.below,
    });
  };

  const showDualPreview = mode === 'video';
  const primaryLabel =
    mode === 'video'
      ? '영상 프롬프트'
      : mode === 'character'
        ? '캐릭터 프롬프트'
        : '이미지 프롬프트';

  return (
    <div
      className={`app${selectedChips.length > 0 ? ' has-sel-preview' : ''}${previewOpen ? ' sel-preview-open' : ''}`}
    >
      <header className="topbar header">
        <div className="topbar-inner header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden />
            <div>
              <h1>Higgsfield Prompt Builder</h1>
              <p className="tagline">
                클릭으로 조합하는 이미지 · 영상 프롬프트 · higgsfield.ai
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setShowFavPanel((v) => !v);
                setShowHistPanel(false);
              }}
              aria-expanded={showFavPanel}
            >
              ★ 즐겨찾기 ({favorites.length})
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setShowHistPanel((v) => !v);
                setShowFavPanel(false);
              }}
              aria-expanded={showHistPanel}
            >
              최근 ({history.length})
            </button>
            <button type="button" className="btn ghost" onClick={onReset}>
              전체 초기화
            </button>
          </div>
        </div>
      </header>

      <div className="workspace">
        <main className="main-col">
          <section className="tip-banner" role="note">
            <strong>팁</strong>
            <span>
              사진 먼저 만들고, 영상은 동작·카메라·길이만 짧게. 칩에
              마우스를 올리면 미리보기가 떠. <kbd>/</kbd> 로 칩 검색.
            </span>
          </section>

          {(showFavPanel || showHistPanel) && (
            <section
              className="storage-panel"
              aria-label={showFavPanel ? '즐겨찾기' : '히스토리'}
            >
              <div className="storage-head">
                <h2 className="section-title" style={{ margin: 0 }}>
                  {showFavPanel ? '즐겨찾기' : '최근 생성 (최대 10)'}
                </h2>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setShowFavPanel(false);
                    setShowHistPanel(false);
                  }}
                >
                  닫기
                </button>
              </div>
              <ul className="storage-list">
                {(showFavPanel ? favorites : history).length === 0 && (
                  <li className="storage-empty">비어 있습니다</li>
                )}
                {(showFavPanel ? favorites : history).map((item) => (
                  <li key={item.id} className="storage-item">
                    <div className="storage-meta">
                      <span className="storage-mode">{item.mode}</span>
                      {item.label && (
                        <span className="storage-label">{item.label}</span>
                      )}
                    </div>
                    <pre className="storage-text">{item.text}</pre>
                    <div className="storage-actions">
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          copyText(item.text, '저장된 프롬프트')
                        }
                      >
                        복사
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => loadStored(item)}
                      >
                        불러오기
                      </button>
                      {showFavPanel && (
                        <button
                          type="button"
                          className="btn ghost"
                          onClick={() => deleteFavorite(item.id)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="modes" aria-label="모드 선택">
            <div className="segmented" role="tablist">
              {MODE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.id}
                  className={`seg-btn ${mode === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setMode(tab.id);
                    setActivePreset(null);
                    clearTips();
                  }}
                >
                  <span className="seg-label">{tab.label}</span>
                  <span className="seg-hint">{tab.hint}</span>
                </button>
              ))}
            </div>
            {(mode === 'image' || mode === 'character') && (
              <button
                type="button"
                className="btn keyframe-switch"
                onClick={switchKeyframeToVideo}
              >
                키프레임 → 영상
              </button>
            )}
          </section>

          <section className="presets" aria-label="프리셋">
            <h2 className="section-title">
              {mode === 'video'
                ? '영상 프리셋'
                : mode === 'character'
                  ? '캐릭터 프리셋'
                  : '이미지 프리셋'}
              <span className="preset-count"> {visiblePresets.length}</span>
            </h2>
            <div className="preset-row">
              {visiblePresets.length === 0 && (
                <p className="empty-filter">이 탭용 프리셋 없음</p>
              )}
              {visiblePresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`preset-chip ${activePreset === p.id ? 'active' : ''}`}
                  onClick={() => {
                    applyPreset(p);
                    clearTips();
                  }}
                  onMouseEnter={(e) => showPresetTip(e, p.id, p.labelKo)}
                  onMouseLeave={() => setPresetHover(null)}
                  onFocus={(e) => showPresetTip(e, p.id, p.labelKo)}
                  onBlur={() => setPresetHover(null)}
                >
                  {p.labelKo}
                </button>
              ))}
            </div>
          </section>

          <section className="free-text">
            <div className="field">
              <label htmlFor="idea">
                아이디어 (한글 돼. 영어로 섞어 줄게)
              </label>
              <textarea
                id="idea"
                rows={2}
                placeholder="예: 노을 질 때 루프탑, 영화 같은 인물 컷"
                value={ideaKo}
                onChange={(e) => {
                  setIdeaKo(e.target.value);
                  setActivePreset(null);
                }}
              />
              {ideaPreview && ideaKo !== ideaPreview && (
                <p className="idea-preview">영어로는: {ideaPreview}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="custom">추가로 붙일 영어 문구</label>
              <textarea
                id="custom"
                rows={2}
                placeholder="Extra English phrases to append…"
                value={customEn}
                onChange={(e) => {
                  setCustomEn(e.target.value);
                  setActivePreset(null);
                }}
              />
            </div>
          </section>

          <div className="chip-stage">
            <div className="chip-picker">
            <section className="chip-search" aria-label="칩 검색">
              <label htmlFor="chip-filter" className="sr-only">
                필터: 칩 검색
              </label>
              <input
                ref={searchRef}
                id="chip-filter"
                type="search"
                className="chip-search-input"
                placeholder="칩 찾기 (한글·영어, / 단축키)"
                value={chipQuery}
                onChange={(e) => setChipQuery(e.target.value)}
                autoComplete="off"
              />
            </section>

            {selectedChips.length > 0 && (
              <section className="selected-strip" aria-label="선택된 칩">
                <h2 className="section-title">선택됨</h2>
                <div className="selected-pills">
                  {selectedChips.map(({ chip, cat }) => (
                    <button
                      key={chip.id}
                      type="button"
                      className="selected-pill"
                      title={`${cat.labelKo}: ${chip.valueEn}`}
                      onClick={() => onToggle(chip.id)}
                      aria-label={`${chip.labelKo} 제거`}
                    >
                      <span className="pill-cat">{cat.labelKo}</span>
                      {chip.labelKo}
                      <span className="pill-x" aria-hidden>
                        ×
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="chips-panel" aria-label="칩 카테고리">
              {filteredCategories.length === 0 && (
                <p className="empty-filter">검색 결과 없음</p>
              )}
              {filteredCategories.map((cat) => {
                const isRequired = !!cat.required?.includes(mode);
                const isMissing =
                  isRequired && !selectedByCategory.has(cat.id);
                return (
                <div
                  key={cat.id}
                  className={`category${isRequired ? ' is-required' : ''}${isMissing ? ' is-missing' : ''}`}
                  data-required={isRequired ? 'true' : undefined}
                >
                  <div className="category-head">
                    <h3>{cat.labelKo}</h3>
                    {cat.required?.includes(mode) && (
                      <span className="badge badge-required">필수</span>
                    )}
                    {cat.exclusive && (
                      <span className="badge">하나만</span>
                    )}
                    {cat.required?.includes(mode) &&
                      !selectedByCategory.has(cat.id) && (
                        <span className="badge badge-missing">아직</span>
                      )}
                  </div>
                  <div className="chip-grid">
                    {cat.chips.map((chip) => {
                    const on = selectedIds.includes(chip.id);
                    const blocked = !on && blockedChipIds.has(chip.id);
                    const blockBy = blocked
                      ? blockingSelectedLabels(
                          chip.id,
                          selectedIds,
                          (id) => chipById(id)?.labelKo ?? id,
                        )
                      : [];
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        className={`chip${on ? ' selected' : ''}${blocked ? ' is-blocked' : ''}`}
                        aria-pressed={on}
                        aria-disabled={blocked || undefined}
                        disabled={blocked}
                        title={
                          blocked
                            ? `상충: ${blockBy.join(', ')} 때문에 고를 수 없어`
                            : chip.valueEn
                        }
                        onClick={() => {
                          if (blocked) {
                            showToast(
                              `상충돼서 못 골라: ${blockBy.join(', ')}`,
                            );
                            return;
                          }
                          onToggle(chip.id);
                        }}
                        onMouseEnter={(e) => {
                          if (!blocked) showChipTip(e, chip, cat);
                        }}
                        onMouseLeave={() => setHoverPreview(null)}
                        onFocus={(e) => {
                          if (!blocked) showChipTip(e, chip, cat);
                        }}
                        onBlur={() => setHoverPreview(null)}
                      >
                        <ChipThumb chip={chip} catId={cat.id} tiny />
                        <span>{chip.labelKo}</span>
                      </button>
                    );
                  })}
                  </div>
                </div>
              );
              })}
            </section>

              {missingRequired.length > 0 && (
                <div className="required-hint" role="status">
                  <span className="required-hint-label">아직 안 고른 필수</span>
                  <span className="required-hint-list">
                    {missingRequired.map((c) => c.labelKo).join(' · ')}
                  </span>
                </div>
              )}
            </div>
            <aside
              className={`rail selection-preview${previewOpen ? ' is-open' : ' is-collapsed'}`}
              aria-label="선택 프리뷰"
            >
              <button
                type="button"
                className="selection-preview-toggle"
                aria-expanded={previewOpen}
                onClick={() => setPreviewOpen((v) => !v)}
              >
                <span className="section-title" style={{ margin: 0 }}>
                  선택 프리뷰 ({selectedChips.length})
                </span>
                <span className="selection-preview-chevron" aria-hidden>
                  {previewOpen ? '▸' : '◂'}
                </span>
              </button>
              <h2 className="section-title selection-preview-heading">선택 프리뷰</h2>
              {lastSelectedChip && (
                <div className="selection-hero" aria-label="최근 선택 미리보기">
                  <ChipThumb chip={lastSelectedChip.chip} catId={lastSelectedChip.cat.id} />
                  <div className="selection-hero-meta">
                    <span className="selection-hero-cat">{lastSelectedChip.cat.labelKo}</span>
                    <span className="selection-hero-label">{lastSelectedChip.chip.labelKo}</span>
                    <span className="selection-hero-en">{lastSelectedChip.chip.valueEn}</span>
                  </div>
                </div>
              )}
              {selectedChips.length === 0 ? (
                <p className="selection-empty">
                  칩 고르면 여기 미리보기가 모여
                </p>
              ) : (
                <>
                <div className="selection-preview-actions">
                  <button
                    type="button"
                    className="btn ghost selection-export"
                    onClick={exportSelection}
                    disabled={selectedChips.length === 0}
                  >
                    <span className="btn-ico" aria-hidden>
                      ↓
                    </span>
                    내보내기
                  </button>
                  <button
                    type="button"
                    className="btn ghost selection-delete"
                    onClick={clearSelection}
                    disabled={selectedChips.length === 0}
                  >
                    <span className="btn-ico" aria-hidden>
                      ⌫
                    </span>
                    삭제
                  </button>
                </div>
                <div className="selection-grid">
                  {selectedChips.map(({ chip, cat }) => (
                    <div key={chip.id} className="selection-card">
                      <button
                        type="button"
                        className="selection-remove"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onToggle(chip.id)}
                        title={`${chip.labelKo} 삭제`}
                        aria-label={`${chip.labelKo} 삭제`}
                      >
                        ×
                      </button>
                      <ChipThumb chip={chip} catId={cat.id} />
                      <span className="selection-label">{chip.labelKo}</span>
                    </div>
                  ))}
                </div>
                </>
              )}
            </aside>
          </div>

          <section className="prompt-stage previews" aria-label="프롬프트 미리보기">
            {layerTags.length > 0 && (
              <div className="layer-tags" aria-label="레이어 구조">
                {layerTags.map((tag) => (
                  <span key={tag} className="layer-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {showDualPreview ? (
              <>
                <PromptPanel
                  title="이미지 프롬프트"
                  subtitle="키프레임·이미지용"
                  text={result.imagePrompt}
                  onCopy={() =>
                    copyText(result.imagePrompt, '이미지 프롬프트')
                  }
                  onStar={starFavorite}
                  copyDisabled={!canCopyPrompt}
                  copyHint={
                    !canCopyPrompt
                      ? `필수 먼저: ${missingRequired.map((c) => c.labelKo).join(', ')}`
                      : undefined
                  }
                />
                <PromptPanel
                  title="영상 모션 프롬프트"
                  subtitle="영상용 · 동작·카메라 위주"
                  text={result.videoPrompt}
                  accent
                  onCopy={() =>
                    copyText(result.videoPrompt, '영상 프롬프트')
                  }
                  onStar={starFavorite}
                  copyDisabled={!canCopyPrompt}
                  copyHint={
                    !canCopyPrompt
                      ? `필수 먼저: ${missingRequired.map((c) => c.labelKo).join(', ')}`
                      : undefined
                  }
                />
              </>
            ) : (
              <PromptPanel
                title={
                  mode === 'character'
                    ? '캐릭터 프롬프트'
                    : '이미지 프롬프트'
                }
                subtitle="Higgsfield에 붙일 영어 문구"
                text={result.imagePrompt}
                accent
                onCopy={() =>
                  copyText(
                    result.imagePrompt,
                    mode === 'character'
                      ? '캐릭터 프롬프트'
                      : '이미지 프롬프트',
                  )
                }
                onStar={starFavorite}
                  copyDisabled={!canCopyPrompt}
                  copyHint={
                    !canCopyPrompt
                      ? `필수 먼저: ${missingRequired.map((c) => c.labelKo).join(', ')}`
                      : undefined
                  }
              />
            )}
          </section>

          <footer className="footer">
            <p>
              유명인·브랜드 로고·IP는 넣지 않아. 나온 문구는 higgsfield.ai에
              그대로 붙여 쓰면 돼.
            </p>
            <p className="meta">
              선택 {selectedIds.length}개 · 카테고리{' '}
              {visibleCategories.length}개 · 칩 데이터{' '}
              {CATEGORIES.reduce((n, c) => n + c.chips.length, 0)}개 ·
              프리셋 {visiblePresets.length}/{PRESETS.length}개
            </p>
          </footer>
        </main>

        {/* Selection preview — desktop sticky sidebar / mobile right vertical rail */}      </div>

      <div className="sticky-bar" role="region" aria-label="빠른 복사">
        <div className="sticky-inner">
          <span className="sticky-count">
            선택 <strong>{selectedIds.length}</strong>개
          </span>
          <button
            type="button"
            className="btn ghost star-btn"
            onClick={starFavorite}
            aria-label="즐겨찾기 저장"
            title="즐겨찾기"
          >
            ★
          </button>
          <button
            type="button"
            className="btn primary sticky-copy"
            disabled={!canCopyPrompt || !result.primary.trim()}
            title={
              !canCopyPrompt
                ? `필수 먼저: ${missingRequired.map((c) => c.labelKo).join(', ')}`
                : undefined
            }
            onClick={() => copyText(result.primary, primaryLabel)}
          >
            {primaryLabel} 복사
          </button>
        </div>
      </div>

      {hoverPreview && (
        <ChipTooltip
          chip={hoverPreview.chip}
          cat={hoverPreview.cat}
          x={hoverPreview.x}
          y={hoverPreview.y}
          below={hoverPreview.below}
        />
      )}

      {presetHover && PRESET_COVERS[presetHover.id] && (
        <div
          className={`float-preview preset-float${presetHover.below ? ' float-below' : ''}`}
          style={{
            left: presetHover.x,
            top: presetHover.y,
          }}
          role="tooltip"
        >
          <img
            src={PRESET_COVERS[presetHover.id]}
            alt=""
            width={160}
            height={100}
          />
          <span>{presetHover.label}</span>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function ChipThumb({
  chip,
  catId,
  tiny,
}: {
  chip: Chip;
  catId: string;
  tiny?: boolean;
}) {
  const meta = resolvePreview(
    chip.id,
    catId,
    chip.previewUrl,
    chip.previewTone,
  );
  const cls = tiny ? 'chip-thumb tiny' : 'chip-thumb';
  if (meta.previewUrl) {
    return (
      <span className={cls}>
        <img
          src={meta.previewUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = 'none';
            const parent = t.parentElement;
            if (parent) {
              parent.style.background = meta.previewTone || '#333';
            }
          }}
        />
      </span>
    );
  }
  return (
    <span
      className={`${cls} tone-only`}
      style={{ background: meta.previewTone }}
      aria-hidden
    />
  );
}

function ChipTooltip({
  chip,
  cat,
  x,
  y,
  below,
}: {
  chip: Chip;
  cat: ChipCategory;
  x: number;
  y: number;
  below?: boolean;
}) {
  const meta = resolvePreview(
    chip.id,
    cat.id,
    chip.previewUrl,
    chip.previewTone,
  );
  return (
    <div
      className={`float-preview chip-float${below ? ' float-below' : ''}`}
      style={{ left: x, top: y }}
      role="tooltip"
    >
      {meta.previewUrl ? (
        <img src={meta.previewUrl} alt="" width={148} height={100} />
      ) : (
        <div
          className="float-tone"
          style={{ background: meta.previewTone }}
        />
      )}
      <span className="float-label">{chip.labelKo}</span>
      <span className="float-en">{chip.valueEn}</span>
    </div>
  );
}

function PromptPanel({
  title,
  subtitle,
  text,
  onCopy,
  onStar,
  accent,
  copyDisabled,
  copyHint,
}: {
  title: string;
  subtitle: string;
  text: string;
  onCopy: () => void;
  onStar?: () => void;
  accent?: boolean;
  copyDisabled?: boolean;
  copyHint?: string;
}) {
  return (
    <div className={`prompt-panel ${accent ? 'accent' : ''}`}>
      <div className="prompt-head">
        <div>
          <h2>{title}</h2>
          <p className="prompt-sub">{subtitle}</p>
        </div>
        <div className="prompt-actions">
          {onStar && (
            <button
              type="button"
              className="btn ghost"
              onClick={onStar}
              aria-label="즐겨찾기"
              title="즐겨찾기"
            >
              ★
            </button>
          )}
          <button
            type="button"
            className="btn primary"
            onClick={onCopy}
            disabled={!!copyDisabled || !text.trim()}
            title={copyDisabled ? copyHint : undefined}
          >
            복사
          </button>
        </div>
      </div>
      {copyDisabled && copyHint && (
        <p className="copy-gate-hint">{copyHint}</p>
      )}
      <pre className="prompt-body">
        {text || '칩을 고르거나 아이디어를 적어 봐…'}
      </pre>
    </div>
  );
}

export default App;
