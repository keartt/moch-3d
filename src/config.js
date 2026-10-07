// 청첩장 내용은 전부 여기서 수정

// ponytail: 더미 이미지는 SVG 로 생성. 실제 사진은 public/photos/1.jpg 처럼 넣고 경로 문자열로 교체
const ph = (label, a, b) =>
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="600" height="800" fill="url(#g)"/>
<circle cx="300" cy="340" r="110" fill="#fff" opacity=".55"/>
<text x="300" y="370" font-size="96" text-anchor="middle">💕</text>
<text x="300" y="560" font-size="44" text-anchor="middle" fill="#fff" font-family="sans-serif">${label}</text></svg>`)

const colors = [
  ['#ffd1dc', '#ffb3c6'], ['#cde7ff', '#a8d1ff'], ['#d9f7d6', '#b5e8b0'],
  ['#fff1c1', '#ffe08a'], ['#e8d9ff', '#cdb4ff'], ['#ffe0cc', '#ffc4a3'],
]

export const W = {
  groom: { name: '김신랑', first: '신랑', father: '김아빠', mother: '이엄마', order: '장남' },
  bride: { name: '박신부', first: '신부', father: '박아빠', mother: '최엄마', order: '차녀' },
  date: '2027-05-15T12:30:00+09:00',
  venue: {
    name: '모청 웨딩홀',
    hall: '3층 러블리홀',
    address: '서울특별시 중구 세종대로 110',
    tel: '02-000-0000',
    lat: 37.5663,
    lng: 126.9779,
    transport: [
      ['🚇 지하철', '1·2호선 시청역 4번 출구 도보 3분'],
      ['🚌 버스', '시청앞 정류장 하차 (간선 100, 150, 402)'],
      ['🚗 주차', '건물 지하 주차장 2시간 무료'],
    ],
  },
  greeting: `서로 다른 길을 걷던 두 사람이
같은 곳을 바라보며 걸어가려 합니다.

따뜻한 봄날,
저희의 첫 걸음을 함께 축복해 주세요.`,
  hero: ph('Our Wedding Day', '#ffc8dd', '#bde0fe'),
  photos: colors.map(([a, b], i) => ph(`Photo ${i + 1}`, a, b)),
  accounts: {
    groom: [
      { who: '신랑', holder: '김신랑', bank: '토스뱅크', num: '1000-0000-0001' },
      { who: '신랑 아버지', holder: '김아빠', bank: '국민은행', num: '000000-00-000001' },
      { who: '신랑 어머니', holder: '이엄마', bank: '신한은행', num: '110-000-000001' },
    ],
    bride: [
      { who: '신부', holder: '박신부', bank: '카카오뱅크', num: '3333-00-0000001' },
      { who: '신부 아버지', holder: '박아빠', bank: '우리은행', num: '1002-000-000001' },
      { who: '신부 어머니', holder: '최엄마', bank: '하나은행', num: '000-000000-00001' },
    ],
  },
  bgm: 'bgm.wav',
  // 3D 월드 NPC. pos = [x, z], 섬 반지름은 12
  npcs: [
    { name: '신랑', color: '#3a4a6b', hair: '#2b1d14', bow: true, pos: [-1.2, -6],
      story: '안녕하세요! 와주셔서 고마워요 🤵\n저희는 2021년 봄, 벚꽃길에서 처음 만났어요.', photo: 0 },
    { name: '신부', color: '#ffffff', hair: '#6b4226', veil: true, pos: [1.2, -6],
      story: '반가워요! 👰\n5년 동안 함께 웃고 울며 여기까지 왔답니다. 앞으로도 잘 부탁드려요!', photo: 1 },
    { name: '첫 데이트 요정', color: '#ffb3c6', hair: '#ff6b9a', pos: [-7, 1],
      story: '두 사람의 첫 데이트는 한강 피크닉이었어요 🧺\n신랑이 김밥을 쌌는데 다 터졌대요.', photo: 2 },
    { name: '프로포즈 요정', color: '#cdb4ff', hair: '#7b5cd6', pos: [7, 1],
      story: '프로포즈는 제주도 바닷가에서! 💍\n신부는 울고, 신랑은 더 울었답니다.', photo: 3 },
    { name: '안내 토끼', color: '#fff1c1', hair: '#f4a261', ears: true, pos: [0, 6],
      story: '여기는 두 사람의 작은 섬이에요 🏝️\n화면을 탭하면 이동해요. 친구들에게 말을 걸어보세요!', photo: 4 },
  ],
}
