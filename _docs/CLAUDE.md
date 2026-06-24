# CLAUDE.md — 프론트엔드 (www)

공통 원칙 → [[CLAUDE|CLAUDE (루트)]] · React 규칙 → [[react_rules]]

---

## 프로젝트 구조

```
www/
├── app/                        # Next.js 15 App Router
│   ├── layout.tsx              # 루트 레이아웃 (전역 폰트·메타데이터)
│   ├── (seoul)/                # 서울 지도 Route Group
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 서울 메인 (채팅 UI)
│   │   └── map/page.tsx        # 지도 페이지
│   ├── titanic/                # 타이타닉 Route Group
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 타이타닉 메인
│   │   ├── passengers/page.tsx # 승객 목록
│   │   ├── predict/page.tsx    # 생존 예측
│   │   └── smith/page.tsx      # 스미스 선장 채팅
│   └── api/
│       └── weather/route.ts    # 날씨 API Route (서버사이드 프록시)
├── components/
│   ├── NavBar.tsx
│   ├── AuthHydrator.tsx
│   ├── PixelAuthModal.tsx
│   ├── PixelTitanic.tsx
│   ├── PixelIceberg.tsx
│   ├── PixelExplosion.tsx
│   └── seoul/                  # 서울 전용 컴포넌트
└── lib/
    ├── api.ts          # fetch 래퍼 (request<T> 함수, BASE_URL, 인증 헤더 자동 주입)
    ├── auth.ts         # 토큰 저장/조회 (localStorage)
    ├── store.ts        # Zustand — 채팅 상태 (useChatStore)
    ├── uiStore.ts      # Zustand — UI 상태 (모달 등)
    ├── mockApi.ts      # 개발용 Mock API
    └── types.ts        # 공유 TypeScript 타입
```

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Next.js | 16.x (App Router) |
| React | 19.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Zustand | 5.x |
| react-markdown | 9.x |
| lucide-react | 1.x |

---

## React 코딩 규칙

`www/` 하위 `.tsx` / `.ts` 파일 작성·수정 시 [[react_rules]] 를 자동 적용한다.

핵심 요약:

### useState 최소화 (자동 트리거)

같은 컴포넌트에 `useState` 2개 이상이면 **묻지 않고** 아래 패턴 중 하나로 압축한다.

**패턴 A — FormData (폼 제출 목적)**
```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const { email, password } = Object.fromEntries(formData.entries());
};
// input에는 value/onChange 대신 name 속성만 부여
```

**패턴 B — 단일 객체 useState (실시간 상태)**
```tsx
const [state, setState] = useState({ field1: "", field2: 0 });
setState(prev => ({ ...prev, field1: newValue }));
```

우선순위: 폼 제출 → 패턴 A / 실시간 반영 → 패턴 B

---

## API 클라이언트 패턴

모든 백엔드 호출은 `lib/api.ts` 의 `request<T>` 함수를 통한다.

```ts
// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init: RequestInit = {}, withAuth = true): Promise<T>
```

- 인증이 필요한 엔드포인트: `withAuth = true` (기본값) — `Authorization: Bearer <token>` 자동 주입
- 인증 불필요: `withAuth = false`
- 새 API 함수는 `lib/api.ts` 에 추가한다. 컴포넌트에서 직접 `fetch` 호출 금지.

---

## 상태 관리 — Zustand

| Store | 파일 | 역할 |
|-------|------|------|
| `useChatStore` | `lib/store.ts` | 채팅 메시지, 로딩 상태, AI 응답 |
| UI 상태 | `lib/uiStore.ts` | 모달 열림/닫힘 등 전역 UI |

- 서버 상태(데이터 패칭)는 Zustand 대신 Server Component + `fetch` 또는 `useEffect` 를 사용한다.
- Zustand store는 `lib/` 에만 둔다. 컴포넌트 파일 안에 store 정의 금지.

---

## 라우팅 규칙 (App Router)

- **Route Group** `(seoul)`, `titanic` 은 URL 경로에 영향을 주지 않는다.
- 공유 레이아웃은 해당 그룹의 `layout.tsx` 에 정의한다.
- API Route (`app/api/**/route.ts`) 는 서버사이드 프록시 또는 민감한 로직에만 사용한다.

---

## 컴포넌트 작성 규칙

- 공유 컴포넌트는 `components/` 에, 특정 그룹 전용은 `components/<group>/` 에 둔다.
- 픽셀 아트 애니메이션 컴포넌트 (`PixelTitanic`, `PixelIceberg`, `PixelExplosion`) 는 기존 인터페이스를 유지한다.
- `NavBar`, `AuthHydrator` 는 루트 레이아웃에서 임포트한다.
- 컴포넌트 파일명: PascalCase (`MyComponent.tsx`)
- 페이지 파일명: `page.tsx` (Next.js 컨벤션 준수)

---

## 환경변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API 기본 URL (기본값: `http://localhost:8000`) |


## 다크모드

구현 스펙·지시어 → [darkmode_spec.md](.docs/darkmode_spec.md)

- `next-themes` + Tailwind 4 `@custom-variant dark` (class 방식), 기본값 `light` + 토글.
- 색상은 `app/globals.css` 의 시맨틱 토큰(`--background`, `--foreground`, `--brand` …)을 `.dark` 에서 오버라이드해 전환한다.
- 토글 컴포넌트: `components/ThemeToggle.tsx` (Topbar/TopNav 우측).