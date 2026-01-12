import { Canvas } from '@react-three/fiber'
import { Environment, Sky, Text } from '@react-three/drei'
import * as THREE from 'three'
import Character3D from './Character3D'
import SpikeField from './Spike'
import { GAME_STATES } from '../App'

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
      camera={{ position: [0, 10, 10], fov: 70 }}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #1E90FF, #87CEEB)'
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

      <Sky sunPosition={[100, 30, 100]}/>
      <Environment preset="park" />


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

      {/* Minecraft-style Fence */}
      <GameAreaFence />

      <Tree position={[-6, 0, -6]} />
      <Tree position={[7, 0, -6]} />
      <Tree position={[-6, 0, 6]} />
      <Tree position={[6, 0, 6]} />
      <Tree position={[-8, 0, 0]} />
      <Tree position={[8, 0, 0]} />

      {/* Additional trees in the north */}
      <Tree position={[-2, 0, -8]} />
      <Tree position={[3, 0, -5]} />

      {/* Grass Bushes - Reduced */}
      <Bush position={[-7, 0, -3]} />
      <Bush position={[7, 0, -3]} />
      <Bush position={[-9, 0, 2]} />
      <Bush position={[9, 0, 2]} />

      {/* Flowers - Reduced */}
      <Flower position={[-4, 0, -5]} color="#FF69B4" />
      <Flower position={[4, 0, -4]} color="#FFD700" />
      <Flower position={[-2, 0, -8]} color="#FF69B4" />
      <Flower position={[2, 0, -8]} color="#FFD700" />

      {/* Rocks - Reduced */}
      <Rock position={[-8, 0, -5]} />
      <Rock position={[8, 0, -4]} />

      {/* Clouds */}
      <Cloud position={[-5, 5, -8]} />
      <Cloud position={[4, 6, -10]} />
      <Cloud position={[0, 5.5, -12]} />
      <Cloud position={[-7, 6, -6]} />
      <Cloud position={[6, 5.5, -7]} />
      <Cloud position={[0, 6.5, -9]} />

      {/* North Area - Bench, Sign, Lantern */}
      <Bench position={[-3, 0, -5.5]} />
      <Lantern position={[-4.2, 0, -5.5]} />
      <Sign position={[1, 0, -6.5]} />

      {/* Campfire - Northeast outside fence */}
      <Campfire position={[5.5, 0, -5.5]} />

      {/* North Area Decorations - Minimal */}
      <Bush position={[-5, 0, -6]} />
      <Bush position={[3.5, 0, -5]} />
      <Flower position={[-1.5, 0, -5.8]} color="#FFD700" />
      <Flower position={[2.5, 0, -7.8]} color="#FF1493" />
      <Rock position={[-2.5, 0, -9]} />

      {/* East & West - Minimal */}
      <Bush position={[6, 0, 2]} />
      <Bush position={[-6, 0, 2]} />
      <Flower position={[5.5, 0, 0]} color="#FFD700" />
      <Flower position={[-5.5, 0, 0]} color="#FFA500" />

      {/* South Area - Near Game Board (Focus Area) */}
      <Bush position={[-3.5, 0, 4.5]} />
      <Bush position={[3.5, 0, 4.5]} />
      <Bush position={[0, 0, 6.5]} />
      <Bush position={[-2.5, 0, 6]} />

      <Flower position={[-3.2, 0, 5]} color="#FF69B4" />
      <Flower position={[3.2, 0, 5.2]} color="#FFD700" />
      <Flower position={[-1.5, 0, 4.8]} color="#FFA500" />
      <Flower position={[1.8, 0, 4.6]} color="#FF1493" />
      <Flower position={[2, 0, 6.8]} color="#FF69B4" />
      <Flower position={[-4, 0, 5.8]} color="#FFD700" />

      <Rock position={[-3.8, 0, 4.8]} />
      <Rock position={[0.5, 0, 5.5]} />
    </Canvas>
  )
}

const Tree = ({ position }) => {
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a2511,
    roughness: 0.8,
    metalness: 0.2,
  })

  const createBranch = (startX, startY, startZ, endX, endY, endZ, radius) => {
    const start = new THREE.Vector3(startX, startY, startZ)
    const end = new THREE.Vector3(endX, endY, endZ)
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()

    const branchGeometry = new THREE.CylinderGeometry(radius, radius * 1.2, length, 6)
    const branch = new THREE.Mesh(branchGeometry, trunkMaterial)

    branch.position.copy(start.clone().add(direction.clone().multiplyScalar(0.5)))

    const axis = new THREE.Vector3(0, 1, 0)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      direction.clone().normalize()
    )
    branch.setRotationFromQuaternion(quaternion)

    return branch
  }

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.175, 2, 8]} />
        <meshStandardMaterial
          color={0x4a2511}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Branch 1 - Center top */}
      <primitive object={createBranch(0, 2, 0, -0.1, 2.75, 0, 0.1)} />
      <mesh castShadow position={[-0.1, 3.25, 0]} scale={[1.3, 1, 1.2]} rotation={[0.3, 0.7, 0.2]}>
        <dodecahedronGeometry args={[0.69, 0]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 2 - Right */}
      <primitive object={createBranch(0, 1.9, 0, 1.25, 2.5, 0.25, 0.09)} />
      <mesh castShadow position={[1.25, 3, 0.25]} scale={[1.4, 1, 1.1]} rotation={[0.5, 0.3, 0.6]}>
        <dodecahedronGeometry args={[0.63, 0]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 3 - Left */}
      <primitive object={createBranch(0, 1.75, 0, -1.1, 2.25, -0.15, 0.09)} />
      <mesh castShadow position={[-1.1, 2.55, -0.15]} scale={[1.2, 1, 1.35]} rotation={[0.2, 0.5, 0.4]}>
        <dodecahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 4 - Bottom left */}
      <primitive object={createBranch(0, 1.25, 0, -0.75, 1.6, 0.4, 0.075)} />
      <mesh castShadow position={[-0.75, 1.8, 0.4]} scale={[1.25, 1, 1.15]} rotation={[0.6, 0.2, 0.3]}>
        <dodecahedronGeometry args={[0.46, 0]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 5 - Bottom right */}
      <primitive object={createBranch(0, 1.4, 0, 0.9, 1.75, -0.25, 0.075)} />
      <mesh castShadow position={[0.9, 2.00, -0.25]} scale={[1.35, 1, 1.25]} rotation={[0.4, 0.6, 0.5]}>
        <dodecahedronGeometry args={[0.43, 0]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
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

const Bush = ({ position }) => {
  return (
    <group position={position}>
      {/* Main bush body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.25, 0.1]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.28, -0.1]} castShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#3CB371" roughness={0.9} />
      </mesh>
    </group>
  )
}

const Flower = ({ position, color }) => {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
      {/* Flower petals */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.06, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.06, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.35, 0.06]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.35, -0.06]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Center */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}

const Rock = ({ position }) => {
  return (
    <group position={position}>
      <mesh castShadow>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#808080" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0.25, 0.05, 0.15]} castShadow>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#696969" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  )
}

const Bench = ({ position }) => {
  return (
    <group position={position}>
      {/* Legs */}
      <mesh position={[-0.4, 0.2, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.2, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      <mesh position={[-0.4, 0.2, -0.2]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.2, -0.2]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.0, 0.1, 0.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.85} />
      </mesh>
      {/* Back support posts */}
      <mesh position={[-0.4, 0.7, -0.2]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.7, -0.2]} castShadow>
        <boxGeometry args={[0.08, 0.6, 0.08]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.9, -0.2]} castShadow>
        <boxGeometry args={[1.0, 0.5, 0.08]} />
        <meshStandardMaterial color="#8B4513" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.8, -0.199]} castShadow>
        <boxGeometry args={[1.0, 0.1, 0.08]} />
        <meshStandardMaterial color="#783b10" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.0, -0.199]} castShadow>
        <boxGeometry args={[1.0, 0.1, 0.08]} />
        <meshStandardMaterial color="#783b10" roughness={0.85} />
      </mesh>
    </group>
  )
}

const Sign = ({ position }) => {
  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 0.0, 0]} castShadow>
        <boxGeometry args={[0.1, 1.7, 0.1]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      {/* Sign board */}
      <mesh position={[0, 1.0, 0]} castShadow rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.05]} />
        <meshStandardMaterial color="#D2691E" roughness={0.8} />
      </mesh>
      {/* Sign border */}
      <mesh position={[0, 1.0, 0.03]} castShadow>
        <boxGeometry args={[0.75, 0.35, 0.02]} />
        <meshStandardMaterial color="#8B4513" roughness={0.85} />
      </mesh>
    </group>
  )
}

const Lantern = ({ position }) => {
  return (
    <group position={position}>
      {/* Wooden pole */}
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 1.5, 6]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>

      {/* Iron bracket */}
      <mesh castShadow position={[0.15, 1.45, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.05]} />
        <meshStandardMaterial color="#424242" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Lantern body - glowing part */}
      <mesh position={[0.3, 1.35, 0]}>
        <boxGeometry args={[0.16, 0.26, 0.16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Iron frame - vertical edges */}
      <mesh castShadow position={[0.21, 1.35, 0.09]}>
        <boxGeometry args={[0.02, 0.32, 0.02]} />
        <meshStandardMaterial color="#424242" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0.39, 1.35, 0.09]}>
        <boxGeometry args={[0.02, 0.32, 0.02]} />
        <meshStandardMaterial color="#424242" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0.21, 1.35, -0.09]}>
        <boxGeometry args={[0.02, 0.32, 0.02]} />
        <meshStandardMaterial color="#424242" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0.39, 1.35, -0.09]}>
        <boxGeometry args={[0.02, 0.32, 0.02]} />
        <meshStandardMaterial color="#424242" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Iron frame - top and bottom */}
      <mesh castShadow position={[0.3, 1.51, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.22]} />
        <meshStandardMaterial color="#424242" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0.3, 1.19, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.22]} />
        <meshStandardMaterial color="#424242" roughness={0.6} metalness={0.7} />
      </mesh>
    </group>
  )
}

const Campfire = ({ position }) => {
  return (
    <group position={position}>
      {/* Logs - 4 pieces */}
      <mesh castShadow position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#4A2511" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.08, 0]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#4A2511" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.16, 0]} rotation={[0, Math.PI / 4, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 6]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.16, 0]} rotation={[0, -Math.PI / 4, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 6]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.9} />
      </mesh>

      {/* Fire */}
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.2, 0.4, 6]} />
        <meshStandardMaterial
          color="#FF6B00"
          emissive="#FF4500"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.12, 0.3, 6]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={2.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

const FencePost = ({ position }) => {
  return (
    <group position={position}>
      {/* Vertical post */}
      <mesh castShadow>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.0, 0]} castShadow>
        <boxGeometry args={[0.14, 1.34, 0.14]} />
        <meshStandardMaterial color="#6B4423" roughness={0.85} />
      </mesh>
    </group>
  )
}

const FenceSection = ({ start, end }) => {
  const midX = (start[0] + end[0]) / 2
  const midZ = (start[2] + end[2]) / 2
  const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2))
  const angle = Math.atan2(end[0] - start[0], end[2] - start[2])

  return (
    <group position={[midX, 0.4, midZ]} rotation={[0, angle, 0]}>
      {/* Upper horizontal rail */}
      <mesh castShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.08, length]} />
        <meshStandardMaterial color="#A0522D" roughness={0.85} />
      </mesh>
      {/* Lower horizontal rail */}
      <mesh castShadow position={[0, -0.12, 0]}>
        <boxGeometry args={[0.08, 0.08, length]} />
        <meshStandardMaterial color="#A0522D" roughness={0.85} />
      </mesh>
    </group>
  )
}

const GameAreaFence = () => {
  const fenceDistance = 4.4
  const spacing = 1.4
  const posts = []
  const sections = []

  // North side
  for (let x = -fenceDistance; x <= fenceDistance; x += spacing) {
    posts.push(<FencePost key={`n-${x}`} position={[x, 0, -fenceDistance]} />)
  }

  // South side
  for (let x = -fenceDistance; x <= fenceDistance; x += spacing) {
    posts.push(<FencePost key={`s-${x}`} position={[x, 0, fenceDistance]} />)
  }

  // West side (excluding corners to avoid duplicate posts)
  for (let z = -fenceDistance + spacing; z < fenceDistance; z += spacing) {
    posts.push(<FencePost key={`w-${z}`} position={[-fenceDistance, 0, z]} />)
  }

  // East side (excluding corners to avoid duplicate posts)
  for (let z = -fenceDistance + spacing; z < fenceDistance; z += spacing) {
    posts.push(<FencePost key={`e-${z}`} position={[fenceDistance, 0, z]} />)
  }

  // Fence sections
  // North side
  for (let x = -fenceDistance; x < fenceDistance; x += spacing) {
    sections.push(
      <FenceSection
        key={`ns-${x}`}
        start={[x, 0, -fenceDistance]}
        end={[Math.min(x + spacing, fenceDistance), 0, -fenceDistance]}
      />
    )
  }

  // South side
  for (let x = -fenceDistance; x < fenceDistance; x += spacing) {
    sections.push(
      <FenceSection
        key={`ss-${x}`}
        start={[x, 0, fenceDistance]}
        end={[Math.min(x + spacing, fenceDistance), 0, fenceDistance]}
      />
    )
  }

  // West side
  for (let z = -fenceDistance; z < fenceDistance; z += spacing) {
    sections.push(
      <FenceSection
        key={`ws-${z}`}
        start={[-fenceDistance, 0, z]}
        end={[-fenceDistance, 0, Math.min(z + spacing, fenceDistance)]}
      />
    )
  }

  // East side
  for (let z = -fenceDistance; z < fenceDistance; z += spacing) {
    sections.push(
      <FenceSection
        key={`es-${z}`}
        start={[fenceDistance, 0, z]}
        end={[fenceDistance, 0, Math.min(z + spacing, fenceDistance)]}
      />
    )
  }

  return (
    <>
      {posts}
      {sections}
    </>
  )
}

export default GameScene3D
