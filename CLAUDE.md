# CLAUDE.md

모바일 청첩장. Vite + React **JSX (TypeScript 쓰지 않음)**. 정적 파일만으로 동작해야 함 (서버/DB 없음).

## 명령

- `npm run dev` — 개발 서버 (`--host`, 휴대폰 접속용)
- `npm run build` — `dist/` 생성. 변경 후 빌드 통과 확인

## 구조

- `src/config.js` — 청첩장 데이터 전부 (이름, 날짜, 장소, 계좌, 사진, NPC). 내용 수정은 여기만
- `src/App.jsx` — 일반 청첩장. 섹션별 작은 컴포넌트가 한 파일에 있음
- `src/World.jsx` — 3D 섬 (three / @react-three/fiber / drei). `React.lazy` 로 3D 모드 진입 시에만 로드
- `src/style.css` — 전체 스타일. 파스텔 핑크, 폰트 Gaegu(제목) / Gowun Dodum(본문)
- `public/bgm.wav` — 직접 생성한 오르골 BGM

## 규칙 / 결정사항

- 3D 모드는 `#3d` 해시 또는 `?3d` 쿼리, 또는 청첩장 안 버튼으로만 진입. 기본은 일반 청첩장
- 라우터 라이브러리 없이 hash 로 분기 → 정적 호스팅에서 rewrite 설정 불필요
- `vite.config.js` 의 `base: './'` 유지 (GitHub Pages 같은 하위 경로 배포 대응)
- 모바일 우선. 글자 크기 `html { font-size: clamp(...vw) }` 로 화면 폭에 맞춰 커지고, 데스크톱은 480px 가운데 정렬
- 캐릭터는 GLB 대신 기본 도형으로 만들어 둔 `Character`. 실제 모델이 생기면 drei `useGLTF` 로 교체
- 사진은 `config.js` 의 SVG 더미 이미지. 실제 사진은 `public/photos/` 에 넣고 경로로 교체
- 방명록은 localStorage (`guestbook` 키). DB 연동 시 `App.jsx` 의 `load` / `save` 함수만 교체
- 지도는 API 키 없는 OpenStreetMap iframe + 네이버/카카오 링크
- 새 라이브러리 추가는 최소화. 캐러셀/확대는 CSS scroll-snap, 아코디언은 `<details>` 처럼 기본 기능 우선
- 의도적으로 단순화한 부분은 `ponytail:` 주석으로 표시

## TODO 후보

- 실제 사진/음악/GLB 교체
- 방명록 DB 연동 (Supabase, Firebase 등)
- 카카오톡 공유 (Kakao JS SDK, 앱 키 필요)
- 배포: Cloudflare Pages (build `npm run build`, output `dist`)
