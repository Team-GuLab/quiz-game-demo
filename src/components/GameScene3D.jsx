import { Canvas, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect } from 'react'
import Character3D from './Character3D'
import SpikeField from './Spike'
import { GAME_STATES } from '../App'

// 카메라를 아래로 향하게 하는 컴포넌트
const TopDownCamera = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 15, 0)
    camera.lookAt(0, 0, 0)
    camera.up.set(0, 0, -1)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

const GameScene3D = ({
  characterPosition,
  currentArea,
  onAreaClick,
  gameState,
  showCorrectAnswer,
  correctAnswer,
  question,
  options,
  score,
  timeLeft,
  totalTime,
  questionIndex,
  totalQuestions,
  isDead,
  aiPlayers,
  playerName
}) => {
  const getAreaColor = (index) => {
    // 민트/핑크 교차 배치
    const colors = ['#A8E6CF', '#FFD3E0', '#FFD3E0', '#A8E6CF']

    if (showCorrectAnswer) {
      if (index === correctAnswer) return '#58CC02' // Duolingo 그린
      if (index !== correctAnswer) return '#E5E5E5' // 연한 회색
    }

    if (index === currentArea) return '#FFE66D' // 밝은 노란색

    return colors[index]
  }

  const areas = [
    { index: 0, x: -2.1, z: -2.1 },
    { index: 1, x: 2.1, z: -2.1 },
    { index: 2, x: -2.1, z: 2.1 },
    { index: 3, x: 2.1, z: 2.1 },
  ]

  return (
    <Canvas
      shadows
      camera={{ fov: 50, near: 0.1, far: 100 }}
      style={{
        width: '100%',
        height: '100%',
        background: '#F5F7FA'
      }}
    >
      <TopDownCamera />
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* 바닥 - 거의 화이트 */}
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#FAFBFC" />
      </mesh>

      {areas.map((area) => (
        <group key={area.index}>
          <mesh
            receiveShadow
            position={[area.x, 0, area.z]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation()
              if (onAreaClick) {
                onAreaClick(area.index)
              }
            }}
          >
            <planeGeometry args={[4.0, 4.0]} />
            <meshStandardMaterial
              color={getAreaColor(area.index)}
              transparent
              opacity={0.9}
            />
          </mesh>

          <lineSegments position={[area.x, 0.02, area.z]}>
            <edgesGeometry
              attach="geometry"
              args={[new THREE.BoxGeometry(4.0, 0.1, 4.0)]}
            />
            <lineBasicMaterial
              attach="material"
              color={area.index === currentArea ? '#FFB800' : '#CCCCCC'}
              linewidth={3}
            />
          </lineSegments>

          {/* 영역 번호 */}
          <Text
            position={[area.x, 0.1, area.z - 1.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.4}
            color="#1F2937"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            {area.index + 1}
          </Text>

          {/* 답안 텍스트 */}
          <Text
            position={[area.x, 0.1, area.z + 0.2]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.28}
            color="#1F2937"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.2}
            textAlign="center"
            outlineWidth={0.02}
            outlineColor="#ffffff"
          >
            {options[area.index]}
          </Text>
        </group>
      ))}

      <Character3D
        position={characterPosition}
        isDead={isDead}
        color="#58CC02"
        isPlayer={true}
        name={playerName}
      />

      {aiPlayers.map((player) => (
        <Character3D
          key={player.id}
          position={{
            x: (player.gridPosition.x / 7) * 100,
            y: (player.gridPosition.y / 7) * 100
          }}
          isDead={!player.isAlive}
          color={player.color}
          name={player.name}
        />
      ))}

      {showCorrectAnswer && gameState === GAME_STATES.RESULT && areas.map((area) => {
        if (area.index === correctAnswer) return null
        return (
          <SpikeField
            key={`spike-${area.index}`}
            areaPosition={[area.x, 0, area.z]}
          />
        )
      })}

      {/* 간소화된 부시 - 4개 모서리만 */}
      <SimpleBush position={[-3.5, 0, -3.5]} />
      <SimpleBush position={[3.5, 0, -3.5]} />
      <SimpleBush position={[-3.5, 0, 3.5]} />
      <SimpleBush position={[3.5, 0, 3.5]} />
    </Canvas>
  )
}

const SimpleBush = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#A8E6CF" roughness={0.7} />
      </mesh>
    </group>
  )
}

export default GameScene3D
