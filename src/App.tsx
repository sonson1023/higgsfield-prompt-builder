import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CATEGORIES,
  PRESETS,
  type Mode,
  type Preset,
} from './data/chips';
import {
  buildPrompt,
  categoriesForMode,
  toggleChip,
  translateIdeaToEnglish,
} from './lib/buildPrompt';
import './App.css';

const MODE_TABS: { id: Mode; label: string; hint: string }[] = [
  { id: 'image', label: '이미지', hint: 'Popcorn / 스틸 · 키프레임' },
  { id: 'video', label: '영상', hint: 'Seedance / Kling / DoP I2V' },
  { id: 'character', label: '캐릭터 베이스', hint: '스튜디오 포트레이트 스타터' },
];

function App() {
  const [mode, setMode] = useState<Mode>('image');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ideaKo, setIdeaKo] = useState('');
  const [customEn, setCustomEn] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const visibleCategories = useMemo(
    () => categoriesForMode(mode),
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

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onToggle = (chipId: string) => {
    setSelectedIds((prev) => toggleChip(prev, chipId));
    setActivePreset(null);
  };

  const onReset = () => {
    setSelectedIds([]);
    setIdeaKo('');
    setCustomEn('');
    setActivePreset(null);
    showToast('전체 초기화됨');
  };

  const applyPreset = (preset: Preset) => {
    setMode(preset.mode);
    setSelectedIds([...preset.chipIds]);
    setIdeaKo(preset.ideaKo ?? '');
    setCustomEn(preset.customEn ?? '');
    setActivePreset(preset.id);
    showToast(`프리셋 적용: ${preset.labelKo}`);
  };

  const copyText = async (text: string, label: string) => {
    if (!text.trim()) {
      showToast('복사할 프롬프트가 비어 있습니다');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} 복사됨`);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`${label} 복사됨`);
    }
  };

  const showDualPreview = mode === 'video';

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden />
            <div>
              <h1>Higgsfield Prompt Builder</h1>
              <p className="tagline">
                클릭으로 조합하는 이미지 · 영상 프롬프트 · higgsfield.ai
              </p>
            </div>
          </div>
          <button type="button" className="btn ghost" onClick={onReset}>
            전체 초기화
          </button>
        </div>
      </header>

      <main className="main">
        <section className="tip-banner" role="note">
          <strong>팁</strong>
          <span>
            이미지 먼저 생성 → 영상은 동작·카메라·타이밍만 짧게. 인물 외형
            재설명은 최소화하세요.
          </span>
        </section>

        {/* Mode tabs */}
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
                }}
              >
                <span className="seg-label">{tab.label}</span>
                <span className="seg-hint">{tab.hint}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Presets */}
        <section className="presets" aria-label="프리셋">
          <h2 className="section-title">프리셋</h2>
          <div className="preset-row">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`preset-chip ${activePreset === p.id ? 'active' : ''}`}
                onClick={() => applyPreset(p)}
              >
                {p.labelKo}
              </button>
            ))}
          </div>
        </section>

        {/* Free text */}
        <section className="free-text">
          <div className="field">
            <label htmlFor="idea">핵심 아이디어 (한국어 OK → 영문 조합)</label>
            <textarea
              id="idea"
              rows={2}
              placeholder="예: 골든아워 루프탑에서 시네마틱 인물 컷"
              value={ideaKo}
              onChange={(e) => {
                setIdeaKo(e.target.value);
                setActivePreset(null);
              }}
            />
            {ideaPreview && ideaKo !== ideaPreview && (
              <p className="idea-preview">영문 해석: {ideaPreview}</p>
            )}
          </div>
          <div className="field">
            <label htmlFor="custom">커스텀 추가 문구 (영어 권장)</label>
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

        {/* Chip categories */}
        <section className="chips-panel" aria-label="칩 카테고리">
          {visibleCategories.map((cat) => (
            <div key={cat.id} className="category">
              <div className="category-head">
                <h3>{cat.labelKo}</h3>
                {cat.exclusive && (
                  <span className="badge">단일 선택</span>
                )}
              </div>
              <div className="chip-grid">
                {cat.chips.map((chip) => {
                  const on = selectedIds.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      className={`chip ${on ? 'selected' : ''}`}
                      aria-pressed={on}
                      title={chip.valueEn}
                      onClick={() => onToggle(chip.id)}
                    >
                      {chip.labelKo}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Preview panels */}
        <section className="previews" aria-label="프롬프트 미리보기">
          {showDualPreview ? (
            <>
              <PromptPanel
                title="이미지 프롬프트"
                subtitle="키프레임 / Popcorn용 (참고)"
                text={result.imagePrompt}
                onCopy={() => copyText(result.imagePrompt, '이미지 프롬프트')}
              />
              <PromptPanel
                title="영상 모션 프롬프트"
                subtitle="I2V · 동작·카메라 중심"
                text={result.videoPrompt}
                accent
                onCopy={() => copyText(result.videoPrompt, '영상 프롬프트')}
              />
            </>
          ) : (
            <PromptPanel
              title={
                mode === 'character'
                  ? '캐릭터 베이스 프롬프트'
                  : '이미지 프롬프트'
              }
              subtitle="Higgsfield 이미지 생성용 · 영어"
              text={result.imagePrompt}
              accent
              onCopy={() =>
                copyText(
                  result.imagePrompt,
                  mode === 'character' ? '캐릭터 프롬프트' : '이미지 프롬프트',
                )
              }
            />
          )}
        </section>

        <footer className="footer">
          <p>
            유명인·브랜드 로고·IP는 칩/출력에 포함하지 않습니다. 생성 결과는
            higgsfield.ai에 직접 붙여넣어 사용하세요.
          </p>
          <p className="meta">
            선택 {selectedIds.length}개 · 카테고리 {visibleCategories.length}개
            · 칩 데이터 {CATEGORIES.reduce((n, c) => n + c.chips.length, 0)}개
          </p>
        </footer>
      </main>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function PromptPanel({
  title,
  subtitle,
  text,
  onCopy,
  accent,
}: {
  title: string;
  subtitle: string;
  text: string;
  onCopy: () => void;
  accent?: boolean;
}) {
  return (
    <div className={`prompt-panel ${accent ? 'accent' : ''}`}>
      <div className="prompt-head">
        <div>
          <h2>{title}</h2>
          <p className="prompt-sub">{subtitle}</p>
        </div>
        <button type="button" className="btn primary" onClick={onCopy}>
          복사
        </button>
      </div>
      <pre className="prompt-body">{text || '칩을 선택하거나 아이디어를 입력하세요…'}</pre>
    </div>
  );
}

export default App;
