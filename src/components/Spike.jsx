import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Spike = ({ position, delay = 0 }) => {
  const groupRef = useRef()
  const spikeHeight = useRef(0)
  const time = useRef(-delay)

  useFrame((state, delta) => {
    time.current += delta

    if (time.current > 0 && spikeHeight.current < 1.5) {
      spikeHeight.current += delta * 3
      if (groupRef.current) {
        groupRef.current.position.y = Math.min(spikeHeight.current - 0.5, 0)
      }
    }
  })

  return (
    <group ref={groupRef} position={[position[0], -0.5, position[2]]}>
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
      const delay = (x + z) * 0.04
      spikes.push(
        <Spike
          key={`${x}-${z}`}
          position={[posX, 0, posZ]}
          delay={delay}
        />
      )
    }
  }

  return <>{spikes}</>
}

export default SpikeField
