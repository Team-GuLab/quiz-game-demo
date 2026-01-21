import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import Character3D from './Character3D'
import SpikeField from './Spike'
import { GAME_STATES } from '../App'

const GRID_SIZE = 8

// 그리드 좌표를 퍼센트로 (Character3D 호환용)
const gridToPercent = (gridX, gridY) => {
  const x = (gridX / (GRID_SIZE - 1)) * 100
  const y = (gridY / (GRID_SIZE - 1)) * 100
  return { x, y }
}

// 탑다운 카메라 설정 (Perspective)
const TopDownCamera = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 15, 0.5) // 훨씬 더 높이 올림
    camera.fov = 95 // 매우 넓은 시야각 (휴대폰 대응)
    camera.lookAt(0, 0, 0)
    camera.up.set(0, 0, -1)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

const GameScene3D = ({
  gridPosition,
  isDead,
  aiPlayers,
  playerName,
  gameState,
  showCorrectAnswer,
  correctAnswer
}) => {
  const playerPos = gridToPercent(gridPosition.x, gridPosition.y)

  // 스파이크 영역 위치 (4개 영역 - 2D 보드와 동기화)
  // 캐릭터 좌표: -4 ~ 4 범위, 각 영역 중심은 ±2
  const spikeAreas = [
    { index: 0, x: -2, z: -2 },  // 좌상단
    { index: 1, x: 2, z: -2 },   // 우상단
    { index: 2, x: -2, z: 2 },   // 좌하단
    { index: 3, x: 2, z: 2 },    // 우하단
  ]

  return (
    <Canvas
      shadows
      camera={{ fov: 95, near: 0.1, far: 100, position: [0, 15, 0.5] }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
        zIndex: 5,
        pointerEvents: 'none'
      }}
      gl={{ alpha: true }}
    >
      <TopDownCamera />

      {/* 그림자만 받는 투명 바닥 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>

      {/* 조명 */}
      <ambientLight intensity={1.0} />
      <directionalLight
        position={[3, 10, 3]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* 플레이어 캐릭터 */}
      <Character3D
        position={playerPos}
        isDead={isDead}
        color="#58CC02"
        isPlayer={true}
        name={playerName}
      />

      {/* AI 캐릭터들 */}
      {aiPlayers.map((player) => (
        <Character3D
          key={player.id}
          position={gridToPercent(player.gridPosition.x, player.gridPosition.y)}
          isDead={!player.isAlive}
          color={player.color}
          name={player.name}
        />
      ))}

      {/* 오답 영역 스파이크 */}
      {showCorrectAnswer && gameState === GAME_STATES.RESULT && spikeAreas.map((area) => {
        if (area.index === correctAnswer) return null
        return (
          <SpikeField
            key={`spike-${area.index}`}
            areaPosition={[area.x, 0, area.z]}
          />
        )
      })}
    </Canvas>
  )
}

export default GameScene3D
