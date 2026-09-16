# Higgsfield Prompt Builder

클릭으로 조합하는 **higgsfield.ai** 이미지·영상 프롬프트 생성기입니다.

- UI 언어: **한국어**
- 생성 프롬프트: **영어** (Higgsfield에 최적)
- 유명인·브랜드 로고·IP 명칭은 칩/출력에 포함하지 않습니다.

## 빠른 시작

```bash
cd /workspace/higgsfield-prompt-builder
npm install
npm run dev
```

브라우저에서 표시되는 주소(기본 `http://localhost:5173`)로 접속하세요.

### 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite 개발 서버 (HMR) |
| `npm run build` | 타입체크 + 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | oxlint (프로젝트 기본) |

## 모드

1. **이미지** — Popcorn / 스틸·키프레임용 풀 프롬프트
2. **영상** — Seedance / Kling / DoP 등 I2V용 모션 프롬프트 (동작·카메라·타이밍 중심)
3. **캐릭터 베이스** — 스튜디오 포트레이트 스타터 (일관 캐릭터용)

## 사용 팁 (Higgsfield)

1. **이미지 먼저** 생성한 뒤, 같은 키프레임으로 **영상(I2V)** 을 돌리세요.
2. 영상 프롬프트는 **외형 재설명보다 동작·카메라 무브·타이밍·분위기**에 집중하세요.
3. 피하기(Avoid)는 짧게 유지하세요.
4. 추천 조립 순서 (이미지): 주제 → 디테일 → 환경 → 스타일 → 조명/카메라/무드 → 품질 → Avoid
5. 프리셋(패션 룩북, 제품 쇼츠, 시네마틱 인물, 먹방/카페, 야경 도시, 자동차 시네마틱, 캐릭터 스튜디오)으로 빠르게 시작하세요.

## 프로젝트 구조

```
src/
  data/chips.ts      # 칩·카테고리·프리셋 데이터
  lib/buildPrompt.ts # 순수 프롬프트 조립 로직
  App.tsx            # UI
  App.css / index.css
```

## 기술 스택

- Vite + React 19 + TypeScript
- 정적 SPA (백엔드 없음)

## 라이선스

개인·학습·제작 워크플로용 도구입니다. Higgsfield 서비스 자체는 해당 플랫폼 약관을 따릅니다.
