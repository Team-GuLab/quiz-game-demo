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
        groupRef.current.position.y = spikeHeight.current - 0.5
      }
    }
  })

  return (
    <group ref={groupRef} position={[position[0], -0.5, position[2]]}>
      <mesh castShadow>
        <coneGeometry args={[0.15, 1.5, 4]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.75, 0]}>
        <coneGeometry args={[0.05, 0.3, 4]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

const SpikeField = ({ areaPosition }) => {
  const spikes = []
  const gridSize = 4
  const spacing = 0.6

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const posX = areaPosition[0] - 1 + x * spacing
      const posZ = areaPosition[2] - 1 + z * spacing
      const delay = (x + z) * 0.05
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
