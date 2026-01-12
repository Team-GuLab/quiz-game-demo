import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const Character3D = ({ position, isDead, color = '#6C5CE7', isPlayer = false, name }) => {
  const groupRef = useRef()
  const bodyRef = useRef()
  const legLeftRef = useRef()
  const legRightRef = useRef()

  const currentPos = useRef({ x: 0, z: 0 })
  const startPos = useRef({ x: 0, z: 0 })
  const targetPos = useRef({ x: 0, z: 0 })
  const moveProgress = useRef(1)

  // Robot metal color - different shades based on original color
  const getMetalColor = () => {
    if (isPlayer) return color

    // Convert original color to different metal shades
    const colorMap = {
      '#FF6B6B': '#B8B8B8', // Light gray
      '#4ECDC4': '#909090', // Medium gray
      '#45B7D1': '#A8A8A8', // Medium-light gray
      '#FFA07A': '#C0C0C0', // Bright gray
      '#98D8C8': '#888888', // Dark gray
    }

    return colorMap[color] || '#A0A0A0'
  }

  const metalColor = getMetalColor()

  const JUMP_DURATION = 0.2
  const JUMP_HEIGHT = 0.6

  const jumpPhase = useRef(0)
  const idleTime = useRef(0)
  const walkTime = useRef(0)
  const deathTime = useRef(0)
  const deathVelocityY = useRef(5)

  useEffect(() => {
    const x = (position.x - 50) * 0.08
    const z = (position.y - 50) * 0.08

    if (Math.abs(targetPos.current.x - x) > 0.01 || Math.abs(targetPos.current.z - z) > 0.01) {
      startPos.current = { ...currentPos.current }
      targetPos.current = { x, z }
      moveProgress.current = 0
    }
  }, [position])

  useFrame((_state, delta) => {
    if (!groupRef.current) return

    if (isDead) {
      deathTime.current += delta
      deathVelocityY.current -= delta * 15
      const newY = groupRef.current.position.y + deathVelocityY.current * delta

      groupRef.current.position.y = newY
      groupRef.current.rotation.x += delta * 5
      groupRef.current.rotation.z += delta * 3

      const scale = Math.max(0, 1 - deathTime.current * 0.8)
      groupRef.current.scale.set(scale, scale, scale)

      return
    }

    const isCurrentlyMoving = moveProgress.current < 1

    if (isCurrentlyMoving) {
      moveProgress.current = Math.min(1, moveProgress.current + delta / JUMP_DURATION)

      const t = moveProgress.current

      currentPos.current.x = THREE.MathUtils.lerp(startPos.current.x, targetPos.current.x, t)
      currentPos.current.z = THREE.MathUtils.lerp(startPos.current.z, targetPos.current.z, t)

      groupRef.current.position.x = currentPos.current.x
      groupRef.current.position.z = currentPos.current.z

      const height = JUMP_HEIGHT * Math.sin(Math.PI * t)
      groupRef.current.position.y = height

      const dirX = targetPos.current.x - startPos.current.x
      const dirZ = targetPos.current.z - startPos.current.z
      if (Math.abs(dirX) > 0.01 || Math.abs(dirZ) > 0.01) {
        const targetRotation = Math.atan2(dirX, dirZ)
        groupRef.current.rotation.y = targetRotation
      }

      walkTime.current += delta * 15
      if (legLeftRef.current && legRightRef.current) {
        legLeftRef.current.rotation.x = Math.sin(walkTime.current) * 0.4
        legRightRef.current.rotation.x = Math.sin(walkTime.current + Math.PI) * 0.4
      }

      if (bodyRef.current) {
        bodyRef.current.rotation.x = Math.sin(moveProgress.current * Math.PI) * 0.2
      }

      return
    }

    if (jumpPhase.current > 0) {
      jumpPhase.current += delta * 8
      if (jumpPhase.current > Math.PI * 2) {
        jumpPhase.current = 0
      }
      const jumpHeight = Math.sin(jumpPhase.current) * 0.5
      groupRef.current.position.y = Math.max(0, jumpHeight)
      groupRef.current.rotation.x = Math.sin(jumpPhase.current) * 0.1
    } else {
      idleTime.current += delta
      groupRef.current.position.y = Math.sin(idleTime.current * 2) * 0.05

      if (legLeftRef.current && legRightRef.current) {
        legLeftRef.current.rotation.x = THREE.MathUtils.lerp(legLeftRef.current.rotation.x, 0, 0.1)
        legRightRef.current.rotation.x = THREE.MathUtils.lerp(legRightRef.current.rotation.x, 0, 0.1)
      }

      if (bodyRef.current) {
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, 0, 0.1)
        bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 0.1)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Nickname displayed above character */}
      {name && !isDead && (
        <Html
          position={[0, 2.0, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              color: isPlayer ? '#FFD93D' : '#FFFFFF',
              fontSize: '28px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              textShadow: isPlayer
                ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 4px rgba(0,0,0,0.8)'
                : '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            {name}
          </div>
        </Html>
      )}

      {/* Head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color={!isPlayer ? metalColor : "#FFD93D"}
          metalness={!isPlayer ? 0.8 : 0}
          roughness={!isPlayer ? 0.2 : 1}
        />
      </mesh>

      {/* Eyes - Different for robot */}
      {!isPlayer ? (
        <>
          {/* Robot LED Eyes - Cute style */}
          <mesh position={[-0.15, 1.25, 0.31]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.15, 1.25, 0.31]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Cute smile */}
          <mesh position={[0, 1.1, 0.31]} castShadow>
            <boxGeometry args={[0.25, 0.04, 0.02]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </>
      ) : (
        <>
          {/* Player Eyes */}
          <mesh position={[-0.15, 1.25, 0.31]} castShadow>
            <boxGeometry args={[0.1, 0.15, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.15, 1.25, 0.31]} castShadow>
            <boxGeometry args={[0.1, 0.15, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </>
      )}

      {/* Robot Antenna - Only for AI */}
      {!isPlayer && (
        <group>
          {/* Antenna Base */}
          <mesh position={[0, 1.55, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Antenna Ball - Cute color */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#FFA500"
              emissive="#FFA500"
              emissiveIntensity={0.4}
              metalness={0.5}
            />
          </mesh>
        </group>
      )}

      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.5]} />
        <meshStandardMaterial
          color={metalColor}
          metalness={!isPlayer ? 0.6 : 0}
          roughness={!isPlayer ? 0.3 : 1}
        />
      </mesh>

      {/* Robot Panel - Only for AI */}
      {!isPlayer && (
        <mesh position={[0, 0.6, 0.26]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.02]} />
          <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.1} />
        </mesh>
      )}

      {/* Left Arm */}
      <mesh position={[-0.4, 0.7, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial
          color={metalColor}
          metalness={!isPlayer ? 0.6 : 0}
          roughness={!isPlayer ? 0.3 : 1}
        />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.4, 0.7, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial
          color={metalColor}
          metalness={!isPlayer ? 0.6 : 0}
          roughness={!isPlayer ? 0.3 : 1}
        />
      </mesh>

      {/* Left Leg */}
      <group ref={legLeftRef} position={[-0.15, 0.2, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={!isPlayer ? 0.6 : 0}
            roughness={!isPlayer ? 0.3 : 1}
          />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={legRightRef} position={[0.15, 0.2, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial
            color={metalColor}
            metalness={!isPlayer ? 0.6 : 0}
            roughness={!isPlayer ? 0.3 : 1}
          />
        </mesh>
      </group>

      {isPlayer && (
        <group position={[0, 2.3, 0]}>
          {/* Arrow shaft */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.1, 0.6, 0.1]} />
            <meshStandardMaterial color="#FF4444" />
          </mesh>

          {/* Arrow head - triangle pointing down */}
          <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.25, 0.35, 4]} />
            <meshStandardMaterial color="#FF4444" />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default Character3D
