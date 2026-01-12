import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Spike = ({ position, delay = 0 }) => {
  const groupRef = useRef()
  const elapsedTime = useRef(-delay)
  const state = useRef('rising') // 'rising', 'holding', 'falling', 'done'
  const holdTimer = useRef(0)

  const RISE_SPEED = 9 // 위로 올라가는 속도
  const FALL_SPEED = 4.5 // 아래로 내려가는 속도
  const HOLD_TIME = 0.1 // 정지 시간
  const MIN_HEIGHT = -1.5 // 최소 높이 (바닥 아래)
  const MAX_HEIGHT = 0 // 최대 높이 (바닥)

  useFrame((_, delta) => {
    elapsedTime.current += delta

    // delay 시간 전에는 아무것도 안함
    if (elapsedTime.current <= 0) return
    if (!groupRef.current) return

    if (state.current === 'rising') {
      // 위로 이동
      const currentY = groupRef.current.position.y
      const newY = currentY + delta * RISE_SPEED

      if (newY >= MAX_HEIGHT) {
        groupRef.current.position.y = MAX_HEIGHT
        state.current = 'holding'
        holdTimer.current = 0
      } else {
        groupRef.current.position.y = newY
      }
    }
    else if (state.current === 'holding') {
      // 0.1초 대기
      holdTimer.current += delta
      if (holdTimer.current >= HOLD_TIME) {
        state.current = 'falling'
      }
    }
    else if (state.current === 'falling') {
      // 아래로 이동
      const currentY = groupRef.current.position.y
      const newY = currentY - delta * FALL_SPEED

      if (newY <= MIN_HEIGHT) {
        groupRef.current.position.y = MIN_HEIGHT
        state.current = 'done'
      } else {
        groupRef.current.position.y = newY
      }
    }
  })

  return (
    <group ref={groupRef} position={[position[0], -1.5, position[2]]}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
        <meshStandardMaterial
          color="#555555"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh castShadow position={[0, 0.6, 0]}>
        <coneGeometry args={[0.12, 1.2, 8]} />
        <meshStandardMaterial
          color="#666666"
          metalness={0.9}
          roughness={0.2}
          emissive="#ff3030"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh castShadow position={[0, 1.1, 0]}>
        <coneGeometry args={[0.04, 0.4, 8]} />
        <meshStandardMaterial
          color="#333333"
          metalness={1.0}
          roughness={0.1}
          emissive="#ff0000"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

const SpikeField = ({ areaPosition }) => {
  const spikes = []
  const gridSize = 7
  const spacing = 0.55

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const posX = areaPosition[0] - 1.65 + x * spacing
      const posZ = areaPosition[2] - 1.65 + z * spacing
      spikes.push(
        <Spike
          key={`${x}-${z}`}
          position={[posX, 0, posZ]}
          delay={0}
        />
      )
    }
  }

  return <>{spikes}</>
}

export default SpikeField
