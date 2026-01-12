import { Canvas } from '@react-three/fiber'
import { Environment, Sky, Text } from '@react-three/drei'
import * as THREE from 'three'
import Character3D from './Character3D'
import SpikeField from './Spike'

const GameScene3D = ({
  characterPosition,
  currentArea,
  onAreaClick,
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
  aiPlayers
}) => {
  const getAreaColor = (index) => {
    const colors = ['#A8E6CF', '#FFD3B6', '#FFAAA5', '#B8E0D2']

    if (showCorrectAnswer) {
      if (index === correctAnswer) return '#2ed573'
      if (index !== correctAnswer) return '#888888'
    }

    if (index === currentArea) return '#FFE66D'

    return colors[index]
  }

  const areas = [
    { index: 0, x: -2, z: -2 },
    { index: 1, x: 2, z: -2 },
    { index: 2, x: -2, z: 2 },
    { index: 3, x: 2, z: 2 },
  ]

  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 8], fov: 60 }}
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)'
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />

      <group position={[0, 2.2, -4]}>
        <mesh castShadow>
          <boxGeometry args={[10, 2, 0.3]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.45}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={9}
          textAlign="center"
          outlineWidth={0.04}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {question}
        </Text>
      </group>

      <group position={[-4.5, 4, -2]}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.8, 0.2]} />
          <meshStandardMaterial color="#6c5ce7" />
        </mesh>
        <Text
          position={[0, 0.15, 0.15]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`문제 ${questionIndex + 1}/${totalQuestions}`}
        </Text>
        <Text
          position={[0, -0.15, 0.15]}
          fontSize={0.25}
          color="#ffd93d"
          anchorX="center"
          anchorY="middle"
        >
          {`${score}점`}
        </Text>
      </group>

      <group position={[4.5, 4, -2]}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.4, 0.2]} />
          <meshStandardMaterial color="#2d2d44" />
        </mesh>
        <mesh castShadow position={[-1 + (timeLeft / totalTime) * 1, 0, 0.15]}>
          <boxGeometry args={[(timeLeft / totalTime) * 2, 0.3, 0.05]} />
          <meshStandardMaterial
            color={timeLeft < 3 ? '#ff4757' : '#2ed573'}
            emissive={timeLeft < 3 ? '#ff4757' : '#2ed573'}
            emissiveIntensity={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.25]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {Math.ceil(timeLeft)}s
        </Text>
      </group>

      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#7EC850" />
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
            <planeGeometry args={[3.8, 3.8]} />
            <meshStandardMaterial
              color={getAreaColor(area.index)}
              transparent
              opacity={0.8}
            />
          </mesh>

          <lineSegments position={[area.x, 0.02, area.z]}>
            <edgesGeometry
              attach="geometry"
              args={[new THREE.BoxGeometry(3.8, 0.1, 3.8)]}
            />
            <lineBasicMaterial
              attach="material"
              color={area.index === currentArea ? '#FFB800' : '#555555'}
              linewidth={3}
            />
          </lineSegments>

          <Text
            position={[area.x, 0.1, area.z - 1.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {area.index + 1}
          </Text>

          <Text
            position={[area.x, 0.1, area.z + 0.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.35}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
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
        color="#6C5CE7"
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
        />
      ))}

      {showCorrectAnswer && areas.map((area) => {
        if (area.index === correctAnswer) return null
        return (
          <SpikeField
            key={`spike-${area.index}`}
            areaPosition={[area.x, 0, area.z]}
          />
        )
      })}

      <Tree position={[-6, 0, -6]} />
      <Tree position={[6, 0, -6]} />
      <Tree position={[-6, 0, 6]} />
      <Tree position={[6, 0, 6]} />
      <Tree position={[-8, 0, 0]} />
      <Tree position={[8, 0, 0]} />

      <Cloud position={[-5, 5, -8]} />
      <Cloud position={[4, 6, -10]} />
      <Cloud position={[0, 5.5, -12]} />
    </Canvas>
  )
}

const Tree = ({ position }) => {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh castShadow position={[0, 1.3, 0]}>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#2D5016" />
      </mesh>
      <mesh castShadow position={[0, 1.8, 0]}>
        <coneGeometry args={[0.7, 0.9, 8]} />
        <meshStandardMaterial color="#3A5F1B" />
      </mesh>
      <mesh castShadow position={[0, 2.2, 0]}>
        <coneGeometry args={[0.5, 0.7, 8]} />
        <meshStandardMaterial color="#4A7023" />
      </mesh>
    </group>
  )
}

const Cloud = ({ position }) => {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
      <mesh position={[-0.4, 0, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
    </group>
  )
}

export default GameScene3D
