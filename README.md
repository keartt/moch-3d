# 💌 모바일 청첩장

Vite + React(JSX) 정적 모바일 청첩장. 3D 섬(메타버스) 모드 포함.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (--host 로 같은 와이파이 휴대폰에서 접속 가능)
npm run build    # dist/ 에 정적 파일 생성 → 아무 정적 호스팅에 업로드
```

## 내용 수정

`src/config.js` 한 파일에서 전부 수정합니다.

- 신랑·신부·혼주 이름, 날짜, 예식장 주소/좌표/교통편
- 인사말, 계좌번호
- 사진: `public/photos/1.jpg` 처럼 넣고 `photos` 배열을 경로로 교체
- 배경음악: `public/` 에 파일을 넣고 `bgm` 값 변경
- 3D 섬 NPC 이름·위치·대사·사진

## 기능

- 메인 이미지, 인사말, 혼주 소개
- 달력 + D-day
- 갤러리 (전체화면 스와이프, 탭하면 확대)
- 지도 (OpenStreetMap) + 네이버지도/카카오맵 링크, 주소 복사
- 계좌번호 복사
- 방명록 (현재 localStorage 저장 → 작성한 기기에서만 보임)
- 배경음악, 링크 공유

## 3D 섬 모드

주소 뒤에 `#3d` 또는 `?3d` 를 붙이거나, 청첩장의 **3D 섬 입장하기** 버튼으로 진입합니다.

- 화면을 탭/클릭하면 캐릭터가 이동
- NPC 근처로 가면 사진과 이야기가 표시됨
- 캐릭터는 기본 도형으로 만들어져 있음. GLB 모델을 쓰려면 `src/World.jsx` 의 `Character` 를 drei `useGLTF` 로 교체

## 구조

```
src/config.js   청첩장 데이터
src/App.jsx     일반 청첩장 화면
src/World.jsx   3D 섬 (진입할 때만 로드)
src/style.css   스타일
public/bgm.wav  배경음악
```
