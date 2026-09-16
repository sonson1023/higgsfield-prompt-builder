# Higgsfield Prompt Builder

클릭으로 조합하는 **higgsfield.ai** 이미지·영상 프롬프트 생성기입니다.

- UI 언어: **한국어** / 생성 프롬프트: **영어**
- 유명인·브랜드 로고·IP 명칭은 칩/출력에 포함하지 않습니다.
- Shorts/Reels · 제품·광고 · 시네마틱/MV 세로를 모두 커버하는 풍부한 칩 라이브러리

## 빠른 시작

```bash
cd higgsfield-prompt-builder
npm install
npm run dev
```

### 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | oxlint |

## 주요 기능

1. **모드** — 이미지 / 영상(I2V 모션 블록) / 캐릭터 베이스
2. **칩 검색** — `/` 단축키, 필터 입력
3. **시각 프리뷰** — 칩 호버·포커스 썸네일, 우측(모바일: 상단) **선택 프리뷰** 그리드
4. **즐겨찾기·히스토리** — localStorage (최근 10개)
5. **키프레임 → 영상** — 공유 칩 유지, 외형 칩 정리
6. **레이어 태그·선택 필** — 구조 확인 및 빠른 해제
7. **프리셋 19개+** — 패션·제품·뷰티·쇼츠·브이로그·MV·주얼리·드론 등
8. **GitHub Pages** — `base: /higgsfield-prompt-builder/`, `main` 푸시 시 자동 배포

## Higgsfield 팁

1. 이미지(키프레임) 먼저 → 같은 컷으로 영상(I2V)
2. 영상 프롬프트는 **Action / Camera / Timing / Mood / Audio** 블록 중심
3. 외형 재설명은 최소화, Avoid는 짧게

## 구조

```
src/data/chips.ts      # 칩·카테고리·프리셋
src/data/previews.ts   # Unsplash / SVG 프리뷰 맵
src/lib/buildPrompt.ts # 프롬프트 조립
public/previews/       # 카메라·추상 SVG
```

## 배포 (GitHub Pages)

리포지토리 Settings → Pages → Source: **GitHub Actions**.  
워크플로: `.github/workflows/deploy-pages.yml`

공개 URL 예: `https://<user>.github.io/higgsfield-prompt-builder/`

## 기술 스택

Vite + React 19 + TypeScript · 정적 SPA
