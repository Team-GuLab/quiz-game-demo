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
        height: '100%',
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
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a2511,
    roughness: 0.8,
    metalness: 0.2,
  })

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0xff9bc7,
    roughness: 0.4,
    metalness: 0.1,
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

  const createLeafBlock = (x, y, z, scale = 1) => {
    const geometry = new THREE.BoxGeometry(1.5 * scale, 1 * scale, 1.5 * scale)
    const leaf = new THREE.Mesh(geometry, leafMaterial)
    leaf.position.set(x, y, z)
    leaf.rotation.y = Math.random() * Math.PI * 0.3

    const detail1 = new THREE.Mesh(
      new THREE.BoxGeometry(1.5 * scale, 0.15 * scale, 1.5 * scale),
      new THREE.MeshStandardMaterial({ color: 0xffb5d5, roughness: 0.4 })
    )
    detail1.position.y = -0.3 * scale
    leaf.add(detail1)

    const detail2 = new THREE.Mesh(
      new THREE.BoxGeometry(1.5 * scale, 0.15 * scale, 1.5 * scale),
      new THREE.MeshStandardMaterial({ color: 0xff6fa8, roughness: 0.4 })
    )
    detail2.position.y = -0.45 * scale
    leaf.add(detail2)

    return leaf
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
      <mesh castShadow position={[-0.1, 3.25, 0]}>
        <boxGeometry args={[1.05, 0.7, 1.05]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 2 - Right */}
      <primitive object={createBranch(0, 1.9, 0, 1.25, 2.5, 0.25, 0.09)} />
      <mesh castShadow position={[1.25, 3, 0.25]}>
        <boxGeometry args={[0.975, 0.65, 0.975]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 3 - Left */}
      <primitive object={createBranch(0, 1.75, 0, -1.1, 2.25, -0.15, 0.09)} />
      <mesh castShadow position={[-1.1, 2.75, -0.15]}>
        <boxGeometry args={[0.9, 0.6, 0.9]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 4 - Bottom left */}
      <primitive object={createBranch(0, 1.25, 0, -0.75, 1.6, 0.4, 0.075)} />
      <mesh castShadow position={[-0.75, 2, 0.4]}>
        <boxGeometry args={[0.675, 0.45, 0.675]} />
        <meshStandardMaterial color={0xff9bc7} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Branch 5 - Bottom right */}
      <primitive object={createBranch(0, 1.4, 0, 0.9, 1.75, -0.25, 0.075)} />
      <mesh castShadow position={[0.9, 2.15, -0.25]}>
        <boxGeometry args={[0.6375, 0.425, 0.6375]} />
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

export default GameScene3D
