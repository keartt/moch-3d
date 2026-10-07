import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { W } from './config.js'

// three.js 는 3D 모드 진입 시에만 로드
const World = lazy(() => import('./World.jsx'))
const is3d = () => location.hash === '#3d' || new URLSearchParams(location.search).has('3d')

export default function App() {
  const [mode3d, setMode3d] = useState(is3d)
  useEffect(() => {
    const on = () => setMode3d(is3d())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  if (mode3d)
    return (
      <Suspense fallback={<div className="loading">섬으로 이동 중... 🏝️</div>}>
        <World onExit={() => (location.hash = '')} />
      </Suspense>
    )
  return <Invitation />
}

const d = new Date(W.date)
const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const dateText = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${DAYS[d.getDay()]}요일 ${
  d.getHours() < 12 ? '오전' : '오후'} ${d.getHours() % 12 || 12}시${d.getMinutes() ? ` ${d.getMinutes()}분` : ''}`

function useToast() {
  const [msg, setMsg] = useState('')
  const t = useRef()
  const show = (m) => {
    setMsg(m)
    clearTimeout(t.current)
    t.current = setTimeout(() => setMsg(''), 1800)
  }
  return [msg && <div className="toast">{msg}</div>, show]
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // http 환경(clipboard API 불가) 대비
    const ta = Object.assign(document.createElement('textarea'), { value: text })
    document.body.append(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

// 스크롤 시 살짝 떠오르는 섹션
function Section({ title, sub, children }) {
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (ref.current.classList.add('show'), io.disconnect()), { threshold: 0.15 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <section ref={ref} className="sec">
      {sub && <p className="sub">{sub}</p>}
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}

function Invitation() {
  const [toast, show] = useToast()
  return (
    <main className="wrap">
      <Music />
      <header className="hero">
        <img src={W.hero} alt="" />
        <div className="hero-txt">
          <p className="sub">WE ARE GETTING MARRIED</p>
          <h1>{W.groom.first} <span className="heart">♥</span> {W.bride.first}</h1>
          <p>{dateText}</p>
          <p>{W.venue.name} {W.venue.hall}</p>
        </div>
      </header>

      <Section sub="INVITATION" title="소중한 분들을 초대합니다">
        <p className="pre">{W.greeting}</p>
        <div className="parents">
          <p>{W.groom.father} · {W.groom.mother} 의 {W.groom.order} <b>{W.groom.name}</b></p>
          <p>{W.bride.father} · {W.bride.mother} 의 {W.bride.order} <b>{W.bride.name}</b></p>
        </div>
      </Section>

      <Section sub="CALENDAR" title={`${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`}>
        <p style={{ marginTop: "-1rem", marginBottom: "1rem" }}>{dateText}</p>
        <Calendar />
      </Section>

      <Section sub="GALLERY" title="우리의 순간들">
        <Gallery />
      </Section>

      <Section sub="METAVERSE" title="우리 섬에 놀러오세요">
        <p>귀여운 3D 섬에서 신랑 신부를 만나보세요!</p>
        <a className="btn big" href="#3d">🏝️ 3D 섬 입장하기</a>
      </Section>

      <Section sub="LOCATION" title="오시는 길">
        <MapBox show={show} />
      </Section>

      <Section sub="ACCOUNT" title="마음 전하실 곳">
        <Accounts title="신랑측" list={W.accounts.groom} show={show} />
        <Accounts title="신부측" list={W.accounts.bride} show={show} />
      </Section>

      <Section sub="GUESTBOOK" title="축하 메시지">
        <Guestbook show={show} />
      </Section>

      <Section>
        <button className="btn" onClick={async () => {
          const data = { title: document.title, url: location.href.split('#')[0] }
          if (navigator.share) return navigator.share(data).catch(() => {})
          await copy(data.url)
          show('청첩장 링크를 복사했어요')
        }}>💌 청첩장 공유하기</button>
        <p className="foot">{W.groom.first} & {W.bride.first} · Thank you</p>
      </Section>
      {toast}
    </main>
  )
}

function Music() {
  const a = useRef()
  const [on, setOn] = useState(false)
  const toggle = () => (on ? a.current.pause() : a.current.play().catch(() => {}))
  return (
    <>
      <audio ref={a} src={W.bgm} loop onPlay={() => setOn(true)} onPause={() => setOn(false)} />
      <button className={`music ${on ? 'on' : ''}`} onClick={toggle} aria-label="배경음악">
        {on ? '🎵' : '🔇'}
      </button>
    </>
  )
}

function Calendar() {
  const y = d.getFullYear(), m = d.getMonth()
  const first = new Date(y, m, 1).getDay()
  const last = new Date(y, m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: last }, (_, i) => i + 1)]
  const dday = Math.ceil((new Date(y, m, d.getDate()) - new Date().setHours(0, 0, 0, 0)) / 864e5)
  return (
    <>
      <div className="cal">
        <p className="cal-m">{m + 1}월</p>
        <div className="cal-g">
          {DAYS.map((x) => <b key={x}>{x}</b>)}
          {cells.map((n, i) => (
            <span key={i} className={n === d.getDate() ? 'day' : i % 7 === 0 ? 'sun' : ''}>{n}</span>
          ))}
        </div>
      </div>
      <p className="dday">
        {dday > 0 ? <>결혼식까지 <b>D-{dday}</b> 남았어요</> : dday === 0 ? <b>오늘 결혼합니다! 🎉</b> : <>결혼한 지 <b>{-dday}</b>일 💕</>}
      </p>
    </>
  )
}

function Gallery() {
  const [open, setOpen] = useState(-1)
  return (
    <>
      <div className="grid">
        {W.photos.map((p, i) => <img key={i} src={p} alt="" loading="lazy" onClick={() => setOpen(i)} />)}
      </div>
      {open >= 0 && <Lightbox start={open} onClose={() => setOpen(-1)} />}
    </>
  )
}

// 스와이프 = CSS scroll-snap, 확대 = 사진 탭 시 2배 + 스크롤로 이동
function Lightbox({ start, onClose }) {
  const ref = useRef()
  const [idx, setIdx] = useState(start)
  const [zoom, setZoom] = useState(false)
  useEffect(() => {
    ref.current.scrollLeft = start * ref.current.clientWidth
    document.body.style.overflow = 'hidden'
    return () => (document.body.style.overflow = '')
  }, [start])
  const go = (i) => ref.current.scrollTo({ left: i * ref.current.clientWidth, behavior: 'smooth' })
  return (
    <div className="lb">
      <div className="lb-track" ref={ref} onScroll={(e) => {
        const i = Math.round(e.target.scrollLeft / e.target.clientWidth)
        if (i !== idx) setIdx(i), setZoom(false)
      }}>
        {W.photos.map((p, i) => (
          <div key={i} className={`lb-slide ${zoom && i === idx ? 'zoom' : ''}`}>
            <img src={p} alt="" onClick={() => setZoom(!zoom)} />
          </div>
        ))}
      </div>
      <button className="lb-x" onClick={onClose}>✕</button>
      {idx > 0 && <button className="lb-nav l" onClick={() => go(idx - 1)}>‹</button>}
      {idx < W.photos.length - 1 && <button className="lb-nav r" onClick={() => go(idx + 1)}>›</button>}
      <p className="lb-cnt">{idx + 1} / {W.photos.length} · 탭하면 확대</p>
    </div>
  )
}

function MapBox({ show }) {
  const { lat, lng, name, address, tel, transport } = W.venue
  const q = encodeURIComponent(name)
  const bbox = [lng - 0.004, lat - 0.0025, lng + 0.004, lat + 0.0025].join(',')
  return (
    <>
      <iframe className="map" title="지도" loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`} />
      <p><b>{name} {W.venue.hall}</b></p>
      <p className="addr" onClick={() => copy(address).then(() => show('주소를 복사했어요'))}>{address} 📋</p>
      <div className="links">
        <a className="btn" href={`https://map.naver.com/p/search/${q}`} target="_blank" rel="noreferrer">네이버지도</a>
        <a className="btn" href={`https://map.kakao.com/link/map/${q},${lat},${lng}`} target="_blank" rel="noreferrer">카카오맵</a>
      </div>
      <a className="btn ghost" href={`tel:${tel}`}>📞 예식장 전화하기</a>
      <dl className="trans">
        {transport.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </>
  )
}

function Accounts({ title, list, show }) {
  return (
    <details className="acc">
      <summary>{title} 계좌번호 보기</summary>
      {list.map((a) => (
        <div key={a.num} className="acc-row">
          <div>
            <small>{a.who}</small>
            <p>{a.bank} {a.num}</p>
            <small>예금주 {a.holder}</small>
          </div>
          <button className="btn sm" onClick={() => copy(`${a.bank} ${a.num}`).then(() => show('계좌번호를 복사했어요'))}>복사</button>
        </div>
      ))}
    </details>
  )
}

// ponytail: 로컬스토리지 저장(본인 브라우저에서만 보임). DB 붙일 때 load/save 두 함수만 API 호출로 교체
const GB_KEY = 'guestbook'
const load = () => { try { return JSON.parse(localStorage.getItem(GB_KEY)) || [] } catch { return [] } }
const save = (list) => { try { localStorage.setItem(GB_KEY, JSON.stringify(list)) } catch {} }

function Guestbook({ show }) {
  const [list, setList] = useState(load)
  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    const name = f.get('name').trim(), msg = f.get('msg').trim()
    if (!name || !msg) return show('이름과 메시지를 입력해주세요')
    const next = [{ id: Date.now(), name, msg, at: new Date().toLocaleDateString('ko-KR') }, ...list]
    setList(next)
    save(next)
    e.target.reset()
    show('축하 메시지가 등록됐어요 💕')
  }
  const remove = (id) => {
    if (!confirm('삭제할까요?')) return
    const next = list.filter((x) => x.id !== id)
    setList(next)
    save(next)
  }
  return (
    <>
      <form className="gb-form" onSubmit={submit}>
        <input name="name" placeholder="이름" maxLength={20} />
        <textarea name="msg" placeholder="축하 메시지를 남겨주세요" maxLength={300} rows={3} />
        <button className="btn">남기기 ✍️</button>
      </form>
      <ul className="gb">
        {list.map((x) => (
          <li key={x.id}>
            <p className="gb-h"><b>{x.name}</b><small>{x.at}</small><button onClick={() => remove(x.id)}>✕</button></p>
            <p className="pre">{x.msg}</p>
          </li>
        ))}
        {!list.length && <li className="empty">첫 번째 축하를 남겨주세요 🌷</li>}
      </ul>
    </>
  )
}
