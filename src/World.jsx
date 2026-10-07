import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { W } from './config.js'

const R = 11 // 이동 가능 반경
const TALK = 1.8 // 이 거리 안이면 NPC 가 말을 검
const SPEED = 4

export default function World({ onExit }) {
  const [near, setNear] = useState(null)
  const [closed, setClosed] = useState(null)
  const npc = near !== null && near !== closed ? W.npcs[near] : null
  return (
    <div className="world">
      <Canvas shadows camera={{ position: [0, 12, 21], fov: 40 }} dpr={[1, 2]}>
        <Scene onNear={(i) => { setNear(i); if (i === null) setClosed(null) }} />
      </Canvas>
      <button className="w-exit" onClick={onExit}>← 청첩장</button>
      <p className="w-hint">화면을 탭하면 이동해요 · 친구에게 다가가 보세요</p>
      {npc && (
        <div className="w-talk" key={near}>
          <img src={W.photos[npc.photo]} alt="" />
          <div>
            <b>{npc.name}</b>
            <p className="pre">{npc.story}</p>
            <button className="btn sm" onClick={() => setClosed(near)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Scene({ onNear }) {
  const target = useRef(new THREE.Vector3(0, 0, 9))
  const moveTo = (p) => {
    const v = new THREE.Vector3(p.x, 0, p.z)
    if (v.length() > R) v.setLength(R)
    target.current.copy(v)
  }
  return (
    <>
      <color attach="background" args={['#cdeeff']} />
      <hemisphereLight args={['#ffffff', '#b8e6a0', 1.1]} />
      <directionalLight position={[8, 15, 6]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} />

      {/* 바다 + 섬 */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.6}>
        <circleGeometry args={[60, 48]} />
        <meshStandardMaterial color="#8fd3ff" />
      </mesh>
      <mesh position-y={-0.5} receiveShadow onClick={(e) => moveTo(e.point)}>
        <cylinderGeometry args={[12.5, 13, 1, 48]} />
        <meshStandardMaterial color="#b8e6a0" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 1.5]} receiveShadow>
        <planeGeometry args={[1.8, 15]} />
        <meshStandardMaterial color="#ffe8c2" />
      </mesh>

      <Arch />
      {TREES.map((p, i) => <Tree key={i} position={p} />)}
      {FLOWERS.map(([x, z, c], i) => (
        <mesh key={i} position={[x, 0.12, z]} castShadow>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}

      {W.npcs.map((n, i) => (
        <group key={i} position={[n.pos[0], 0, n.pos[1]]} rotation-y={Math.atan2(-n.pos[0], 9 - n.pos[1])}
          onClick={(e) => { e.stopPropagation(); moveTo({ x: n.pos[0], z: n.pos[1] + 1.2 }) }}>
          <Character {...n} />
          <Html position={[0, 2.1, 0]} center className="w-label">{n.name} 💬</Html>
        </group>
      ))}

      <Player target={target} npcs={W.npcs} onNear={onNear} />
    </>
  )
}

function Player({ target, npcs, onNear }) {
  const g = useRef()
  const ring = useRef()
  const moving = useRef(false)
  const near = useRef(null)
  const camPos = new THREE.Vector3()
  useFrame(({ camera }, dt) => {
    const p = g.current.position
    const diff = target.current.clone().sub(p)
    const dist = diff.length()
    moving.current = dist > 0.05
    if (moving.current) {
      p.add(diff.setLength(Math.min(dist, SPEED * dt)))
      const want = Math.atan2(diff.x, diff.z)
      // 최단 방향으로 회전
      const d = ((want - g.current.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      g.current.rotation.y += d * Math.min(1, dt * 12)
    }
    ring.current.position.set(target.current.x, 0.03, target.current.z)
    ring.current.visible = moving.current

    camera.position.lerp(camPos.set(p.x, p.y + 12, p.z + 12), Math.min(1, dt * 3))
    camera.lookAt(p.x, p.y + 0.5, p.z)

    let found = null
    npcs.forEach((n, i) => { if (Math.hypot(n.pos[0] - p.x, n.pos[1] - p.z) < TALK) found = i })
    if (found !== near.current) onNear((near.current = found))
  })
  return (
    <>
      <group ref={g} position={[0, 0, 9]}>
        <Character color="#ffd166" hair="#3d2b1f" moving={moving} />
        <Html position={[0, 2.1, 0]} center className="w-label me">나</Html>
      </group>
      <mesh ref={ring} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.3, 0.45, 24]} />
        <meshBasicMaterial color="#ff8fab" />
      </mesh>
    </>
  )
}

// ponytail: GLB 대신 기본 도형으로 만든 캐릭터. 실제 모델은 drei useGLTF('/models/x.glb') 로 교체
function Character({ color, hair, skin = '#ffe0c8', bow, veil, ears, moving }) {
  const body = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    body.current.position.y = moving?.current ? Math.abs(Math.sin(t * 12)) * 0.15 : Math.sin(t * 2) * 0.03
  })
  return (
    <group ref={body}>
      <mesh position-y={0.6} castShadow>
        <capsuleGeometry args={[0.33, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position-y={1.28} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      <mesh position-y={1.3} rotation-x={-0.5}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hair} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.14, 1.24, 0.36]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh position={[s * 0.24, 1.14, 0.31]} scale={[1, 0.6, 0.5]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#ff9eb5" />
          </mesh>
          <mesh position={[s * 0.15, 0.12, 0.05]} castShadow>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#5a4636" />
          </mesh>
          {ears && (
            <mesh position={[s * 0.16, 1.85, -0.05]} rotation-z={-s * 0.15}>
              <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
              <meshStandardMaterial color="#fff" />
            </mesh>
          )}
          {bow && (
            <mesh position={[s * 0.09, 0.98, 0.32]} rotation-z={s * 0.5}>
              <coneGeometry args={[0.08, 0.16, 4]} />
              <meshStandardMaterial color="#e63946" />
            </mesh>
          )}
        </group>
      ))}
      {veil && (
        <mesh position={[0, 1.15, -0.25]}>
          <coneGeometry args={[0.5, 1.3, 24, 1, true]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position-y={0.4} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.8]} />
        <meshStandardMaterial color="#a67c52" />
      </mesh>
      <mesh position-y={1.3} castShadow>
        <sphereGeometry args={[0.75, 16, 16]} />
        <meshStandardMaterial color="#ffc8dd" />
      </mesh>
    </group>
  )
}

function Arch() {
  return (
    <group position={[0, 0, -7.2]}>
      <mesh position-y={0.1} castShadow>
        <torusGeometry args={[2.2, 0.16, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 8) * Math.PI
        return (
          <mesh key={i} position={[Math.cos(a) * 2.2, 0.1 + Math.sin(a) * 2.2, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color={i % 2 ? '#ff8fab' : '#ffd6e0'} />
          </mesh>
        )
      })}
    </group>
  )
}

// 장식 위치 (고정 시드)
const rand = (s => () => ((s = (s * 16807) % 2147483647) / 2147483647))(7)
const TREES = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2, r = 9.5 + rand() * 1.5
  return [Math.cos(a) * r, 0, Math.sin(a) * r]
}).filter(([x, , z]) => !(Math.abs(x) < 2 && z > 0)) // 시작 지점 길목은 비움
const FLOWERS = Array.from({ length: 40 }, () => {
  const a = rand() * Math.PI * 2, r = 3 + rand() * 7
  return [Math.cos(a) * r, Math.sin(a) * r, ['#ff8fab', '#ffd166', '#cdb4ff', '#fff'][Math.floor(rand() * 4)]]
})
